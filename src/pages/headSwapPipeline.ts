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

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && (window as any).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

// Submits the image blobs alongside the Razorpay credentials verified by the frontend
async function callPaidPipeline(
    srcBlob: Blob,
    targetBlob: Blob,
    paymentDetails: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }
): Promise<string> {
    const formData = new FormData();
    formData.append("source", srcBlob);
    formData.append("target", targetBlob);
    formData.append("razorpay_payment_id", paymentDetails.razorpay_payment_id);
    formData.append("razorpay_order_id", paymentDetails.razorpay_order_id);
    formData.append("razorpay_signature", paymentDetails.razorpay_signature);

    const response = await fetch("/api/headswap-paid", {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(err.error || `Server error: ${response.status}`);
    }

    const { predictionId } = await response.json();
    if (!predictionId) throw new Error("No prediction ID returned from paid pipeline");

    // ── Async Polling Loop (Prevents 30s Serverless Timeout) ──
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Poll every 2 seconds

        const checkRes = await fetch("/api/check-headswap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ predictionId })
        });

        if (!checkRes.ok) {
            const err = await checkRes.json().catch(() => ({ error: `HTTP ${checkRes.status}` }));
            throw new Error(err.error || `Server status check failed: ${checkRes.status}`);
        }

        const checkData = await checkRes.json();

        if (checkData.status === "succeeded") {
            if (!checkData.url) throw new Error("Success state reached but no URL returned.");
            return checkData.url;
        } else if (checkData.status === "failed" || checkData.status === "canceled") {
            throw new Error(`AI generation ${checkData.status}`);
        }
        // Otherwise status is processing/starting, continue polling...
    }
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

    // ── Stage 0: Create Order & Launch Razorpay ──
    onProgress(5, "Preparing Razorpay Checkout...");
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) throw new Error("Could not load payment gateway. Please check your connection.");

    const orderRes = await fetch("/api/create-order", { method: "POST" });
    if (!orderRes.ok) throw new Error("Failed to initialize secure checkout session.");
    const orderData = await orderRes.json();

    const paymentDetails = await new Promise<{ razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
            key: orderData.key_id,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "PromptHub",
            description: "PRO Head Swap Generation",
            order_id: orderData.order_id,
            handler: function (response: any) {
                // Payment Success Callback
                resolve(response);
            },
            modal: {
                ondismiss: function () {
                    // Payment Cancelled Callback
                    reject(new Error("Payment was cancelled by the user."));
                }
            }
        });
        rzp.on("payment.failed", function (response: any) {
            reject(new Error(`Payment failed: ${response.error.description}`));
        });
        rzp.open();
    });

    // ── Stage 1: Send verified payment & images to Replicate proxy ──
    sim.start(10, 80, 20000, (p) => onProgress(p, "Processing PRO Image on Replicate..."));
    const finalUrl = await callPaidPipeline(srcBlob, targetBlob, paymentDetails);
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
    sim.start(90, 100, 1000, (p) => onProgress(p, "Finalizing..."));

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
