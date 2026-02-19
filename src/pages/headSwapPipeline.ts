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

async function resizeToMax512(file: File): Promise<File> {
    const du = await blobToDataURL(file);
    const im = await loadImageFromDataURL(du);
    if (im.width <= 512 && im.height <= 512) return file;
    const sc = Math.min(512 / im.width, 512 / im.height);
    const cv = document.createElement("canvas");
    cv.width = Math.round(im.width * sc);
    cv.height = Math.round(im.height * sc);
    cv.getContext("2d")!.drawImage(im, 0, 0, cv.width, cv.height);
    return new Promise<File>((resolve) =>
        cv.toBlob((b) => resolve(new File([b!], file.name, { type: "image/jpeg" })), "image/jpeg", 0.92)
    );
}

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

    // ── Stage 1: InsightFace — face identity onto target ──────────────────────
    onProgress(25, "Swapping face identity...");
    const swapClient = await Client.connect("tonyassi/face-swap", clientOptions);
    const swapResult = await swapClient.predict("/swap_faces", {
        src_img: resizedSrc,
        dest_img: resizedTarget,
    });

    onProgress(42, "Hair transfer preparing...");
    const swapData = swapResult.data as any[];
    const swapOut = swapData[0];
    const rawUrl = swapOut?.url ?? swapOut?.path ?? null;
    if (!rawUrl) throw new Error("No output from face swap model.");

    const hsFaceUrl = rawUrl.startsWith("http")
        ? rawUrl
        : `https://tonyassi-face-swap.hf.space/gradio_api/file=${rawUrl}`;

    const hsFaceBlob = await (await fetch(hsFaceUrl)).blob();
    const hsFaceFile = new File([hsFaceBlob], "hs_face.jpg", { type: "image/jpeg" });

    // ── Stage 2: HairFastGAN — transfer hair shape + colour from source ───────
    onProgress(50, "Transferring hairstyle...");
    let hairResultUrl = hsFaceUrl; // fallback to face-only if hair transfer fails

    try {
        const hairFaceFile = await resizeToMax512(hsFaceFile);   // target input (gets new hair)
        const hairShapeFile = await resizeToMax512(resizedSrc);  // source input (hair shape + colour)

        const hairClient = await Client.connect("AIRI-Institute/HairFastGAN", clientOptions);
        const hairResult = await Promise.race([
            hairClient.predict("/swap_hair", {
                face: hairFaceFile,
                shape: hairShapeFile,
                color: hairShapeFile,
                blending: "Article",
                poisson_iters: 0,
                poisson_erosion: 1,
            }),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("HairFastGAN timeout after 90s")), 90000)
            ),
        ]);

        const hairData = (hairResult as any).data as any[];
        const hairOut = hairData[0];
        const hairRaw: string = hairOut?.url ?? hairOut?.path ?? "";
        if (hairRaw) {
            hairResultUrl = hairRaw.startsWith("http")
                ? hairRaw
                : `https://airi-institute-hairfastgan.hf.space/gradio_api/file=${hairRaw}`;
        }
    } catch (hairErr: any) {
        console.warn("HairFastGAN skipped, using face-only result:", hairErr?.message, hairErr);
    }

    onProgress(65, "Enhancing face details...");

    // ── Stage 3: Download hair result and run pro enhancement pipeline ────────
    const hairBlob = await (await fetch(hairResultUrl)).blob();
    const hairDataURL = await blobToDataURL(hairBlob);
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

    // CodeFormer → GFPGANv1.4 fallback
    let cfFile = cropFile;
    try {
        const cfClient = await Client.connect("sczhou/CodeFormer", clientOptions);
        const cfResult = await Promise.race([
            cfClient.predict("/inference", {
                image: cropFile,
                face_align: true,
                background_enhance: false,
                face_upsample: true,
                upscale: 2,
                codeformer_fidelity: 0.7,
            }),
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
        console.warn("CodeFormer unavailable, trying GFPGANv1.4 fallback:", cfErr?.message);
        try {
            const gf2Client = await Client.connect(
                "MayankTamakuwala/Image-Upscaler-and-Restoring-GFPGAN-Algorithm",
                clientOptions
            );
            const gf2Result = await Promise.race([
                gf2Client.predict("/predict", [cropFile, "GFPGANv1.4", 2]),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error("GFPGANv1.4 timeout")), 60000)
                ),
            ]);
            const gf2Data = (gf2Result as any).data as any[];
            const gf2Out = gf2Data[0];
            const gf2Url: string = gf2Out?.url ?? gf2Out?.path ?? "";
            if (gf2Url && gf2Url.startsWith("http")) {
                const gf2Blob = await (await fetch(gf2Url)).blob();
                cfFile = new File([gf2Blob], "gfpgan_enhanced.jpg", { type: "image/jpeg" });
            }
        } catch (gf2Err: any) {
            console.warn("GFPGANv1.4 fallback also skipped:", gf2Err?.message);
        }
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
