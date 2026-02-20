/**
 * headSwapPipeline.ts
 *
 * Self-contained head swap pipeline:
 *   1. InsightFace  — copy source face identity onto target
 *   2. HairFastGAN  — transfer source hair shape + colour
 *   3. CodeFormer   — face detail enhancement (GFPGANv1.4 fallback)
 *   4. Eye blend + colour match + feather edge (client-side canvas)
 *
 * Imported by FaceSwap.tsx for the "Head Swap" tab.
 * No dependency on FaceSwap.tsx internals.
 */

import { Client } from "@gradio/client";

// ─── Helpers (duplicated so this file is fully self-contained) ────────────────

function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const timer = setTimeout(() => reject(new Error("Image read timeout.")), 15000);
        reader.onload = () => { clearTimeout(timer); resolve(reader.result as string); };
        reader.onerror = () => { clearTimeout(timer); reject(new Error("Could not read image. Try a JPG or PNG file.")); };
        reader.readAsDataURL(blob);
    });
}

function loadImageFromDataURL(dataURL: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => { img.src = ""; reject(new Error("Image decode timeout.")); }, 15000);
        img.onload = () => { clearTimeout(timer); resolve(img); };
        img.onerror = () => { clearTimeout(timer); reject(new Error("Image decode failed. Try a JPG or PNG file.")); };
        img.src = dataURL;
    });
}

// Removed resizeToMax512 as it is unused by Flux

function applyColorMatch(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    ref: ImageData
): void {
    const refined = ctx.getImageData(0, 0, w, h);
    const rp = refined.data, refp = ref.data;
    let rR = 0, gR = 0, bR = 0;
    const rLen = refp.length / 4;
    for (let i = 0; i < refp.length; i += 4) { rR += refp[i]; gR += refp[i + 1]; bR += refp[i + 2]; }
    rR /= rLen; gR /= rLen; bR /= rLen;
    let rN = 0, gN = 0, bN = 0;
    const nLen = rp.length / 4;
    for (let i = 0; i < rp.length; i += 4) { rN += rp[i]; gN += rp[i + 1]; bN += rp[i + 2]; }
    rN /= nLen; gN /= nLen; bN /= nLen;
    const rA = Math.min(Math.max(rR / (rN || 1), 0.7), 1.4);
    const gA = Math.min(Math.max(gR / (gN || 1), 0.7), 1.4);
    const bA = Math.min(Math.max(bR / (bN || 1), 0.7), 1.4);
    for (let i = 0; i < rp.length; i += 4) {
        rp[i] = Math.min(255, Math.max(0, rp[i] * rA));
        rp[i + 1] = Math.min(255, Math.max(0, rp[i + 1] * gA));
        rp[i + 2] = Math.min(255, Math.max(0, rp[i + 2] * bA));
    }
    ctx.putImageData(refined, 0, 0);
}

function pasteWithFeather(
    fullCtx: CanvasRenderingContext2D,
    refined: HTMLCanvasElement,
    x: number, y: number, w: number, h: number
): void {
    fullCtx.save();
    const mask = document.createElement("canvas");
    mask.width = w; mask.height = h;
    const mCtx = mask.getContext("2d")!;
    const g = mCtx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.375, w / 2, h / 2, Math.max(w, h) / 2);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    mCtx.fillStyle = g;
    mCtx.fillRect(0, 0, w, h);

    const tmp = document.createElement("canvas");
    tmp.width = w; tmp.height = h;
    const tCtx = tmp.getContext("2d")!;
    tCtx.drawImage(refined, 0, 0, w, h);
    tCtx.globalCompositeOperation = "destination-in";
    tCtx.drawImage(mask, 0, 0);

    fullCtx.globalCompositeOperation = "source-over";
    fullCtx.drawImage(tmp, x, y, w, h);
    fullCtx.restore();
}

function applyEyePreservation(
    ctx: CanvasRenderingContext2D,
    original: HTMLCanvasElement,
    w: number, h: number
): void {
    const ex = Math.round(w * 0.2), ey = Math.round(h * 0.15);
    const ew = Math.round(w * 0.6), eh = Math.round(h * 0.25);
    const mask = document.createElement("canvas");
    mask.width = ew; mask.height = eh;
    const mCtx = mask.getContext("2d")!;
    const mg = mCtx.createRadialGradient(ew / 2, eh / 2, Math.min(ew, eh) * 0.15, ew / 2, eh / 2, Math.max(ew, eh) / 2);
    mg.addColorStop(0, "rgba(0,0,0,1)");
    mg.addColorStop(0.7, "rgba(0,0,0,0.6)");
    mg.addColorStop(1, "rgba(0,0,0,0)");
    mCtx.fillStyle = mg;
    mCtx.fillRect(0, 0, ew, eh);

    const ec = document.createElement("canvas");
    ec.width = ew; ec.height = eh;
    const eCtx = ec.getContext("2d")!;
    eCtx.drawImage(original, ex, ey, ew, eh, 0, 0, ew, eh);
    eCtx.globalCompositeOperation = "destination-in";
    eCtx.drawImage(mask, 0, 0);

    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(ec, ex, ey);
    ctx.restore();
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * runHeadSwapPipeline
 *
 * @param resizedSrc    Source person (face + hair to transfer FROM)
 * @param resizedTarget Target scene  (body/scene to swap INTO)
 * @param clientOptions HF token options for @gradio/client
 * @param onProgress    Progress callback (0–100, message)
 * @returns             Object URL of final composited image
 */
export async function runHeadSwapPipeline(
    resizedSrc: File,
    resizedTarget: File,
    clientOptions: Record<string, unknown>,
    onProgress: (pct: number, msg: string) => void
): Promise<string> {

    // ── Stage 1: Flux Generative Head Swap (Face + Hair natively) ────────────
    // Replaces the broken HairFastGAN+InsightFace pipeline.
    // Uses 8 steps for better proportions. Includes automatic fallback space.

    async function runFluxSwap(spaceId: string, label: string): Promise<string> {
        onProgress(20, `Connecting to ${label}...`);
        const swapClient = await Client.connect(spaceId, clientOptions);

        return new Promise<string>(async (resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error(`${label} timed out`)), 120000); // 2 min max

            try {
                const job = swapClient.submit("/face_swap", {
                    reference_face: resizedSrc,
                    target_image: resizedTarget,
                    seed: 0,
                    randomize_seed: true,
                    num_inference_steps: 8, // Higher steps prevent bad proportions/placements
                });

                for await (const msg of job) {
                    if (msg.type === "status") {
                        const status = msg as any;
                        if (status.queue_size && status.queue_size > 0) {
                            const pos = status.position ?? 1;
                            onProgress(Math.max(20, 50 - ((pos / status.queue_size) * 30)), `Queue: ${pos}/${status.queue_size} (${label})...`);
                        } else if (status.stage === "processing") {
                            onProgress(55, `Generating head swap (${label})...`);
                        }
                    } else if (msg.type === "data") {
                        clearTimeout(timeout);
                        const data = (msg as any).data as any[];
                        const swappedOutput = Array.isArray(data[0]) ? data[0][1] : data[0];
                        const url = swappedOutput?.url ?? swappedOutput?.path ?? null;
                        if (!url) reject(new Error("No image returned"));
                        else {
                            const finalUrl = url.startsWith("http")
                                ? url
                                : `https://${spaceId.replace("/", "-").toLowerCase()}.hf.space/gradio_api/file=${url}`;
                            resolve(finalUrl);
                        }
                        return; // exit loop
                    }
                }
            } catch (err) {
                clearTimeout(timeout);
                reject(err);
            }
        });
    }

    let finalSwapUrl: string;
    try {
        // Primary Model: multimodalart/InstantID-FaceID-6M (ZeroGPU, proxied via localhost/netlify edge)
        onProgress(15, "Generating primary Head Swap with InstantID...");
        const primaryClient = await Client.connect(window.location.origin + "/api/hf/instantid");
        const primaryResult = await Promise.race([
            primaryClient.predict("/generate_image", [
                resizedSrc,     // face_image_path
                resizedTarget,  // pose_image_path
                "",             // prompt
                "",             // negative_prompt
                "(No style)",   // style_name
                10,             // num_steps
                1,              // identitynet_strength_ratio
                1,              // adapter_strength_ratio
                0.5,            // canny_strength
                0.5,            // depth_strength
                ["depth", "canny"], // controlnet_selection
                5,              // guidance_scale
                Math.floor(Math.random() * 2147483647), // seed
                "EulerDiscreteScheduler", // scheduler
                false,          // enable_LCM
                false           // enhance_face_region
            ]),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error("InstantID timeout")), 90000))
        ]);
        const data = (primaryResult as any).data as any[];
        const out = data[0];
        const url = Array.isArray(out) ? out[0]?.url || out[0]?.path : out?.url || out?.path;
        if (!url) throw new Error("No image returned from primary model");
        finalSwapUrl = url.startsWith("http")
            ? url
            : `${window.location.origin}/api/hf/instantid/gradio_api/file=${url}`;
    } catch (primaryErr: any) {
        console.warn("Primary InstantID space failed, triggering Flux Backup:", primaryErr?.message ?? primaryErr);
        try {
            onProgress(15, "Primary model busy, using Flux backup swap...");
            finalSwapUrl = await runFluxSwap("laruss5/Flux2-Klein-Face-Swap", "Backup Model");
        } catch (backupErr: any) {
            console.error("Both models failed:", backupErr);
            throw new Error("Head Swap models are currently overloaded. Please try again in 1-2 minutes.");
        }
    }


    // ── Stage 3: Enhancement pipeline on the face-swapped + hair-transferred result
    const finalBlob = await (await fetch(finalSwapUrl)).blob();
    const hairDataURL = await blobToDataURL(finalBlob);
    const bmp = await loadImageFromDataURL(hairDataURL);

    const fullW = bmp.width, fullH = bmp.height;
    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = fullW; fullCanvas.height = fullH;
    const fullCtx = fullCanvas.getContext("2d")!;
    fullCtx.drawImage(bmp, 0, 0);

    // Crop region for face enhancement (top 70% of image, 90% width)
    const cropX = Math.round(fullW * 0.05);
    const cropY = 0;
    const cropW = Math.round(fullW * 0.90);
    const cropH = Math.round(fullH * 0.70);

    let refImageData: ImageData | null = null;
    try { refImageData = fullCtx.getImageData(cropX, cropY, cropW, cropH); }
    catch (e) { console.warn("getImageData blocked:", e); }

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropW; cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext("2d")!;
    cropCtx.drawImage(bmp, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const cropBlob = await new Promise<Blob>((r) =>
        cropCanvas.toBlob((b) => r(b!), "image/jpeg", 0.95)
    );
    const cropFile = new File([cropBlob], "head_crop.jpg", { type: "image/jpeg" });

    // CodeFormer Enhancement
    let cfFile = cropFile;
    try {
        const cfClient = await Client.connect("sczhou/CodeFormer", clientOptions);
        const cfResult = await Promise.race([
            cfClient.predict("/inference", [
                cropFile, // image
                true,     // face_align
                false,    // background_enhance
                true,     // face_upsample
                2,        // upscale
                0.6       // codeformer_fidelity
            ]),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error("CodeFormer timeout")), 60000)),
        ]);
        const cfData = (cfResult as any).data as any[];
        const cfOut = cfData[0];
        let cfUrl: string = cfOut?.url ?? cfOut?.path ?? "";
        if (cfUrl && !cfUrl.startsWith("http")) cfUrl = `https://sczhou-codeformer.hf.space/gradio_api/file=${cfUrl}`;
        if (cfUrl) {
            const cfBlob2 = await (await fetch(cfUrl)).blob();
            cfFile = new File([cfBlob2], "cf_enhanced.jpg", { type: "image/jpeg" });
        }
    } catch (cfErr: any) {
        console.warn("CodeFormer unavailable, using raw swap:", cfErr?.message);
    }

    // ── Stage 4: Eye preserve + colour match + feather composite ─────────────
    onProgress(92, "Final blending and colour matching...");
    const refinedDataURL = await blobToDataURL(cfFile);
    const refinedBmp = await loadImageFromDataURL(refinedDataURL);

    const refinedCanvas = document.createElement("canvas");
    refinedCanvas.width = cropW; refinedCanvas.height = cropH;
    const refinedCtx = refinedCanvas.getContext("2d")!;
    refinedCtx.drawImage(refinedBmp, 0, 0, cropW, cropH);

    applyEyePreservation(refinedCtx, cropCanvas, cropW, cropH);
    if (refImageData) applyColorMatch(refinedCtx, cropW, cropH, refImageData);
    pasteWithFeather(fullCtx, refinedCanvas, cropX, cropY, cropW, cropH);

    return new Promise((resolve) => {
        fullCanvas.toBlob((b) => resolve(URL.createObjectURL(b!)), "image/jpeg", 0.98);
    });
}
