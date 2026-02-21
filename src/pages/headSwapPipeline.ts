/**
 * headSwapPipeline.ts
 *
 * Rebuilt Head Swap Pipeline — uses Netlify serverless functions as proxies.
 * All AI inference runs server-side → no CORS issues on mobile or any browser.
 *
 * Stages:
 *   1. Face Swap  — POST /api/head-swap  → tonyassi/face-swap (HF Space, server-side)
 *   2. Enhance    — POST /api/enhance    → sczhou/CodeFormer (HF Space, server-side)
 *   3. Eye blend + colour match + feather edge (client-side canvas, kept as is)
 *
 * Imported by FaceSwap.tsx for the "Head Swap" tab.
 */

import { ProgressSimulator } from "./FaceSwap";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── API helpers ──────────────────────────────────────────────────────────────

async function callUnifiedPipeline(
    srcBlob: Blob,
    targetBlob: Blob
): Promise<string> {
    const formData = new FormData();
    formData.append("source", srcBlob);
    formData.append("target", targetBlob);

    const response = await fetch("/api/head-swap", {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(err.error || `Server error: ${response.status}`);
    }

    const { url } = await response.json();
    if (!url) throw new Error("No URL returned from server pipeline");
    return url;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * runHeadSwapPipeline
 *
 * @param srcBlob        Source person (face + hair to transfer FROM) - Expects Blob/File
 * @param targetBlob     Target scene  (body/scene to swap INTO) - Expects Blob/File
 * @param _clientOptions (Unused — kept for API compatibility)
 * @param onProgress     Progress callback (0–100, message)
 * @returns              Object URL of final composited image
 */
export async function runHeadSwapPipeline(
    srcBlob: Blob,
    targetBlob: Blob,
    _clientOptions: Record<string, unknown>,
    onProgress: (pct: number, msg: string) => void
): Promise<string> {

    const sim = new ProgressSimulator();

    // ── Stage 1: Send Blobs to unified Netlify proxy (server-side, no CORS) ──
    sim.start(0, 15, 1000, (p) => onProgress(p, "Preparing secure connection..."));
    sim.start(15, 80, 7000, (p) => onProgress(p, "Processing image on secure server..."));
    const finalUrl = await callUnifiedPipeline(srcBlob, targetBlob);
    sim.stop();

    // ── Stage 2: Load the final AI result for canvas work ─────────────────────
    sim.start(80, 90, 2000, (p) => onProgress(p, "Downloading enhanced result..."));
    const finalBlob = await (await fetch(finalUrl)).blob();
    const finalDataURL = await blobToDataURL(finalBlob);
    const bmp = await loadImageFromDataURL(finalDataURL);
    sim.stop();

    const fullW = bmp.width, fullH = bmp.height;
    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = fullW; fullCanvas.height = fullH;
    const fullCtx = fullCanvas.getContext("2d", { willReadFrequently: true })!;
    fullCtx.drawImage(bmp, 0, 0);

    // Crop top 70% face region for enhancement blending
    const cropX = Math.round(fullW * 0.05);
    const cropY = 0;
    const cropW = Math.round(fullW * 0.90);
    const cropH = Math.round(fullH * 0.70);

    let refImageData: ImageData | null = null;
    try { refImageData = fullCtx.getImageData(cropX, cropY, cropW, cropH); }
    catch { /* CORS canvas restriction — skip color match */ }

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropW; cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext("2d", { willReadFrequently: true })!;
    cropCtx.drawImage(bmp, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    // ── Stage 3: Eye preserve + colour match + feather composite ─────────────
    sim.start(90, 100, 1000, (p) => onProgress(p, "Applying final colour grading..."));

    // we re-export the crop to apply blends.
    const refinedBlob = await new Promise<Blob>((r) =>
        cropCanvas.toBlob((b) => r(b!), "image/jpeg", 0.90)
    );
    const refinedDataURL = await blobToDataURL(refinedBlob);
    const refinedBmp = await loadImageFromDataURL(refinedDataURL);

    const refinedCanvas = document.createElement("canvas");
    refinedCanvas.width = cropW; refinedCanvas.height = cropH;
    const refinedCtx = refinedCanvas.getContext("2d", { willReadFrequently: true })!;
    refinedCtx.drawImage(refinedBmp, 0, 0, cropW, cropH);

    applyEyePreservation(refinedCtx, cropCanvas, cropW, cropH);
    if (refImageData) applyColorMatch(refinedCtx, cropW, cropH, refImageData);
    pasteWithFeather(fullCtx, refinedCanvas, cropX, cropY, cropW, cropH);
    sim.stop();

    return new Promise((resolve) => {
        fullCanvas.toBlob((b) => resolve(URL.createObjectURL(b!)), "image/jpeg", 0.90);
    });
}
