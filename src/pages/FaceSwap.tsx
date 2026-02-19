import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Client } from "@gradio/client";
import {
    User,
    UserCircle,
    Sparkles,
    Download,
    RefreshCcw,
    Image as ImageIcon,
    CheckCircle2,
    Target as TargetIcon,
    AlertCircle
} from "lucide-react";
import "./FaceSwap.css";

// Mobile detection
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const MAX_DIMENSION = isMobile ? 1024 : 1280;

// ─── blobToDataURL: FileReader-based, works on all mobile browsers ─────────────
// Avoids blob URL CORS issues, HEIC format failures, and Safari/Chrome quirks
function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const timer = setTimeout(() => reject(new Error("Image read timeout — file may be too large.")), 15000);
        reader.onload = () => { clearTimeout(timer); resolve(reader.result as string); };
        reader.onerror = () => { clearTimeout(timer); reject(new Error("Could not read image. Try a JPG or PNG file.")); };
        reader.readAsDataURL(blob);
    });
}

// ─── loadImageFromDataURL: loads an HTMLImageElement from a dataURL ──────────
function loadImageFromDataURL(dataURL: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => { img.src = ""; reject(new Error("Image decode timeout.")); }, 15000);
        img.onload = () => { clearTimeout(timer); resolve(img); };
        img.onerror = () => { clearTimeout(timer); reject(new Error("Image decode failed. Try a JPG or PNG file.")); };
        img.src = dataURL;
    });
}

// ─── Stage 0a: Resize image from File (desktop path) ────────────────────────
async function resizeImage(file: File, maxDimension = MAX_DIMENSION): Promise<File> {
    const dataURL = await blobToDataURL(file);
    const img = await loadImageFromDataURL(dataURL);
    const { width, height } = img;
    if (width <= maxDimension && height <= maxDimension) return file;
    const scale = Math.min(maxDimension / width, maxDimension / height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return new Promise<File>((resolve) =>
        canvas.toBlob((blob) => resolve(new File([blob!], file.name, { type: "image/jpeg" })), "image/jpeg", 0.92)
    );
}

// ─── Stage 0b: Resize from already-read dataURL (mobile path) ────────────────
// On Android Chrome, File objects become stale after the app goes to background
// (which always happens during gallery/camera selection). This avoids re-reading
// the File entirely by working from the dataURL we already have from handleImageUpload.
async function resizeFromDataURL(dataURL: string, filename = "image.jpg", maxDimension = MAX_DIMENSION): Promise<File> {
    const img = await loadImageFromDataURL(dataURL);
    const { width, height } = img;
    const scale = Math.min(maxDimension / width, maxDimension / height);
    if (width <= maxDimension && height <= maxDimension) {
        // Already small — decode dataURL bytes directly (no FileReader needed)
        const mime = dataURL.split(";")[0].split(":")[1] || "image/jpeg";
        const bin = atob(dataURL.split(",")[1]);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        return new File([arr], filename, { type: mime });
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return new Promise<File>((resolve) =>
        canvas.toBlob((blob) => resolve(new File([blob!], filename, { type: "image/jpeg" })), "image/jpeg", 0.92)
    );
}

// ─── Stage 4: Canvas-based skin tone color matching ─────────────────────────
// Adjusts refined crop RGB to match the original swap face region's color
function applyColorMatch(
    refinedCtx: CanvasRenderingContext2D,
    refinedW: number,
    refinedH: number,
    refImageData: ImageData // original swap region pixels for reference
): void {
    const refined = refinedCtx.getImageData(0, 0, refinedW, refinedH);
    const refPx = refImageData.data;
    const rPx = refined.data;

    // Compute average RGB for reference (original swap crop)
    let rRef = 0, gRef = 0, bRef = 0;
    const refLen = refPx.length / 4;
    for (let i = 0; i < refPx.length; i += 4) {
        rRef += refPx[i]; gRef += refPx[i + 1]; bRef += refPx[i + 2];
    }
    rRef /= refLen; gRef /= refLen; bRef /= refLen;

    // Compute average RGB for refined crop
    let rRfn = 0, gRfn = 0, bRfn = 0;
    const rfnLen = rPx.length / 4;
    for (let i = 0; i < rPx.length; i += 4) {
        rRfn += rPx[i]; gRfn += rPx[i + 1]; bRfn += rPx[i + 2];
    }
    rRfn /= rfnLen; gRfn /= rfnLen; bRfn /= rfnLen;

    // Per-channel adjustment factor (clamp to prevent wild shifts)
    const rAdj = Math.min(Math.max(rRef / (rRfn || 1), 0.7), 1.4);
    const gAdj = Math.min(Math.max(gRef / (gRfn || 1), 0.7), 1.4);
    const bAdj = Math.min(Math.max(bRef / (bRfn || 1), 0.7), 1.4);

    // Apply adjustment
    for (let i = 0; i < rPx.length; i += 4) {
        rPx[i] = Math.min(255, Math.max(0, rPx[i] * rAdj));
        rPx[i + 1] = Math.min(255, Math.max(0, rPx[i + 1] * gAdj));
        rPx[i + 2] = Math.min(255, Math.max(0, rPx[i + 2] * bAdj));
    }
    refinedCtx.putImageData(refined, 0, 0);
}

// ─── Stage 5: Feathered edge blending ────────────────────────────────────────
// Draws refined crop onto fullCtx with a radial gradient alpha mask for seamless edges
function pasteWithFeather(
    fullCtx: CanvasRenderingContext2D,
    refinedCanvas: HTMLCanvasElement,
    cropX: number,
    cropY: number,
    cropW: number,
    cropH: number
): void {
    fullCtx.save();

    // Create feather mask: opaque center → transparent edges
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = cropW;
    maskCanvas.height = cropH;
    const maskCtx = maskCanvas.getContext("2d")!;

    const cx = cropW / 2;
    const cy = cropH / 2;
    const rx = cropW / 2;
    const ry = cropH / 2;
    // Feather starts at 75% of radius so center face is fully opaque
    const grad = maskCtx.createRadialGradient(cx, cy, Math.min(rx, ry) * 0.75, cx, cy, Math.max(rx, ry));
    grad.addColorStop(0, "rgba(0,0,0,1)");   // fully opaque at center
    grad.addColorStop(1, "rgba(0,0,0,0)");   // fully transparent at edge

    maskCtx.fillStyle = grad;
    maskCtx.fillRect(0, 0, cropW, cropH);

    // Draw refined crop onto a temp canvas, masked by the gradient
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = cropW;
    tempCanvas.height = cropH;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.drawImage(refinedCanvas, 0, 0, cropW, cropH);
    tempCtx.globalCompositeOperation = "destination-in";
    tempCtx.drawImage(maskCanvas, 0, 0);

    // Composite blended crop onto full image
    fullCtx.globalCompositeOperation = "source-over";
    fullCtx.drawImage(tempCanvas, cropX, cropY, cropW, cropH);

    fullCtx.restore();
}

// ─── Eye Preservation Blend: restores original eye geometry after enhancement ─
// Blends original swap eye region (40% opacity, feathered) onto enhanced crop
// to prevent source-identity eyes from overwriting target eye structure.
function applyEyePreservation(
    refinedCtx: CanvasRenderingContext2D,
    originalCropCanvas: HTMLCanvasElement,
    cropW: number,
    cropH: number
): void {
    // Both-eye band spanning the eye region of the crop
    const eyeX = Math.round(cropW * 0.2);
    const eyeY = Math.round(cropH * 0.15);
    const eyeW = Math.round(cropW * 0.6);
    const eyeH = Math.round(cropH * 0.25);

    // Feathered mask: fully opaque center, transparent edges
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = eyeW;
    maskCanvas.height = eyeH;
    const maskCtx = maskCanvas.getContext("2d")!;
    const mx = eyeW / 2, my = eyeH / 2;
    const grad = maskCtx.createRadialGradient(
        mx, my, Math.min(mx, my) * 0.3,  // inner (opaque)
        mx, my, Math.max(mx, my)          // outer (transparent)
    );
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(0.7, "rgba(0,0,0,0.6)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    maskCtx.fillStyle = grad;
    maskCtx.fillRect(0, 0, eyeW, eyeH);

    // Extract original swap eye region onto temp canvas
    const eyeCanvas = document.createElement("canvas");
    eyeCanvas.width = eyeW;
    eyeCanvas.height = eyeH;
    const eyeCtx = eyeCanvas.getContext("2d")!;
    eyeCtx.drawImage(originalCropCanvas, eyeX, eyeY, eyeW, eyeH, 0, 0, eyeW, eyeH);
    // Apply feathered mask to eye extract
    eyeCtx.globalCompositeOperation = "destination-in";
    eyeCtx.drawImage(maskCanvas, 0, 0);

    // Blend back onto enhanced face at 40% opacity
    refinedCtx.save();
    refinedCtx.globalAlpha = 0.4;
    refinedCtx.globalCompositeOperation = "source-over";
    refinedCtx.drawImage(eyeCanvas, eyeX, eyeY);
    refinedCtx.restore();
}

// ─── Main Pro Pipeline: CodeFormer → GFPGAN → EyePreserve → ColorMatch → Feather
async function runProPipeline(
    swappedUrl: string,
    clientOptions: any,
    onProgress: (pct: number, msg: string) => void
): Promise<string> {
    // Download swapped image — decode via FileReader/dataURL for full mobile compat
    const swapRes = await fetch(swappedUrl);
    const swapBlob = await swapRes.blob();
    const swapDataURL = await blobToDataURL(swapBlob);
    const bmp = await loadImageFromDataURL(swapDataURL);

    const fullW = bmp.width;
    const fullH = bmp.height;

    // Full image canvas (we'll composite onto this at the end)
    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = fullW;
    fullCanvas.height = fullH;
    const fullCtx = fullCanvas.getContext("2d")!;
    fullCtx.drawImage(bmp, 0, 0);

    // Face crop region (wider + taller for full facial context)
    const cropX = Math.round(fullW * 0.05);
    const cropY = 0;
    const cropW = Math.round(fullW * 0.90);
    const cropH = Math.round(fullH * 0.70);

    // Extract reference pixels for Stage 4 color matching
    // Wrapped in try/catch: mobile Chrome can throw SecurityError on canvas.getImageData
    // when the blob URL came from a cross-origin response. Failure here just skips color match.
    let refImageData: ImageData | null = null;
    try {
        refImageData = fullCtx.getImageData(cropX, cropY, cropW, cropH);
    } catch (secErr) {
        console.warn("getImageData blocked (CORS/taint) — color matching disabled:", secErr);
    }

    // Draw crop to canvas
    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropW;
    cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext("2d")!;
    cropCtx.drawImage(bmp, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const cropBlob = await new Promise<Blob>((r) => cropCanvas.toBlob((b) => r(b!), "image/jpeg", 0.95));
    const cropFile = new File([cropBlob], "face_crop.jpg", { type: "image/jpeg" });

    // ── Stage 3a: CodeFormer Enhancement ────────────────────────────────────
    onProgress(75, "Enhancing face details...");
    let cfFile = cropFile; // fallback if CodeFormer fails
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
            const cfBlob = await (await fetch(cfUrl)).blob();
            cfFile = new File([cfBlob], "cf_enhanced.jpg", { type: "image/jpeg" });
        }
    } catch (e: any) {
        console.warn("CodeFormer skipped:", e?.message);
    }

    // ── Stage 3b: GFPGAN Eye & Feature Refinement ───────────────────────────
    onProgress(85, "Refining eyes and facial features...");
    let refinedFile = cfFile; // fallback if GFPGAN fails
    try {
        const gfClient = await Client.connect("TencentARC/GFPGAN", clientOptions);
        const gfResult = await Promise.race([
            gfClient.predict("/restore", {
                img: cfFile,
                version: "v1.4",
                scale: 2,
            }),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error("GFPGAN timeout")), 45000)),
        ]);
        const gfData = (gfResult as any).data as any[];
        // GFPGAN returns [output_image, ...] — output_image may be in index 0 or 1
        const gfOut = gfData[1] ?? gfData[0];
        let gfUrl: string = gfOut?.url ?? gfOut?.path ?? (typeof gfOut === "string" ? gfOut : "");
        if (gfUrl && !gfUrl.startsWith("http")) gfUrl = `https://tencentarc-gfpgan.hf.space/gradio_api/file=${gfUrl}`;
        if (gfUrl) {
            const gfBlob = await (await fetch(gfUrl)).blob();
            refinedFile = new File([gfBlob], "gf_refined.jpg", { type: "image/jpeg" });
        }
    } catch (e: any) {
        console.warn("GFPGAN skipped:", e?.message);
    }

    // ── Stage 4: Skin Tone Color Matching + Eye Preserve ──────────────────────
    onProgress(92, "Final blending and color matching...");
    // FileReader path: fully mobile-safe, no blob URL CORS issues
    const refinedDataURL = await blobToDataURL(refinedFile);
    const refinedBmp = await loadImageFromDataURL(refinedDataURL);

    const refinedCanvas = document.createElement("canvas");
    refinedCanvas.width = cropW;
    refinedCanvas.height = cropH;
    const refinedCtx = refinedCanvas.getContext("2d")!;
    refinedCtx.drawImage(refinedBmp, 0, 0, cropW, cropH);

    // ── Stage 3c: Eye Preservation Blend ─────────────────────────────────────
    // Blends original swap eye region back at 40% opacity to retain target eye geometry
    onProgress(89, "Refining eye realism...");
    applyEyePreservation(refinedCtx, cropCanvas, cropW, cropH);

    // Only apply color match if we got reference pixels successfully
    if (refImageData) {
        applyColorMatch(refinedCtx, cropW, cropH, refImageData);
    }

    // ── Stage 5: Feathered Edge Blending ─────────────────────────────────────
    pasteWithFeather(fullCtx, refinedCanvas, cropX, cropY, cropW, cropH);

    // ── Export: JPEG quality 0.98 ─────────────────────────────────────────────
    return new Promise((resolve) => {
        fullCanvas.toBlob((b) => resolve(URL.createObjectURL(b!)), "image/jpeg", 0.98);
    });
}

// ─────────────────────────────────────────────────────────────────────────────

export default function FaceSwap() {
    const [swapMode, setSwapMode] = useState<'face' | 'head'>('face');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [targetImage, setTargetImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [showBetaModal, setShowBetaModal] = useState(false);

    const originalInputRef = useRef<HTMLInputElement>(null);
    const targetInputRef = useRef<HTMLInputElement>(null);
    const originalFileRef = useRef<File | null>(null);
    const targetFileRef = useRef<File | null>(null);

    // Pre-warm HF Spaces on page load to eliminate cold starts
    useEffect(() => {
        fetch("https://tonyassi-face-swap.hf.space").catch(() => { });
        fetch("https://sczhou-codeformer.hf.space").catch(() => { });
        fetch("https://tencentarc-gfpgan.hf.space").catch(() => { });
    }, []);

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (val: string | null) => void,
        fileRef: React.MutableRefObject<File | null>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            fileRef.current = file;
            const reader = new FileReader();
            reader.onloadend = () => setter(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!originalFileRef.current || !targetFileRef.current) {
            setError("Please upload both Source and Target images.");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setResultImage(null);
        setProgress(10);
        setStatusMessage("Preparing images...");

        try {
            const hfToken = import.meta.env.VITE_HUGGINGFACE_TOKEN;
            const clientOptions = hfToken ? { token: hfToken as `hf_${string}` } : {};

            // Stage 0: Resize — use already-read dataURL on mobile to avoid stale File handles,
            // fall back to File-based resize on desktop
            let resizedSrc: File;
            let resizedTarget: File;
            if (isMobile && originalImage && targetImage) {
                // Mobile: use the dataURL stored at upload time (File object may be stale)
                resizedSrc = await resizeFromDataURL(originalImage, originalFileRef.current.name);
                resizedTarget = await resizeFromDataURL(targetImage, targetFileRef.current.name);
            } else {
                // Desktop: read from File as usual
                resizedSrc = await resizeImage(originalFileRef.current);
                resizedTarget = await resizeImage(targetFileRef.current);
            }
            setProgress(20);

            if (swapMode === 'face') {
                // Stage 1: InsightFace swap
                setStatusMessage("Swapping faces...");
                setProgress(35);
                const swapClient = await Client.connect("tonyassi/face-swap", clientOptions);
                const swapResult = await swapClient.predict("/swap_faces", {
                    src_img: resizedSrc,
                    dest_img: resizedTarget,
                });

                setProgress(60);
                const data = swapResult.data as any[];
                const swappedOutput = data[0];
                const rawUrl = swappedOutput?.url ?? swappedOutput?.path ?? null;
                if (!rawUrl) throw new Error("No image output from swap model.");

                const swappedUrl = rawUrl.startsWith("http")
                    ? rawUrl
                    : `https://tonyassi-face-swap.hf.space/gradio_api/file=${rawUrl}`;

                // Stages 2–5: Pro pipeline (CodeFormer → GFPGAN → ColorMatch → Feather)
                try {
                    const finalImage = await runProPipeline(
                        swappedUrl,
                        clientOptions,
                        (pct, msg) => { setProgress(pct); setStatusMessage(msg); }
                    );
                    setProgress(100);
                    setResultImage(finalImage);
                } catch (pipelineErr: any) {
                    console.warn("Pro pipeline error, using raw swap:", pipelineErr?.message);
                    setProgress(100);
                    setResultImage(swappedUrl);
                }

            } else {
                // Head Swap mode (unchanged)
                setStatusMessage("Swapping head context...");
                setProgress(25);
                const swapClient = await Client.connect("linoyts/Flux2-Klein-Face-Swap", clientOptions);

                const job = swapClient.submit("/face_swap", {
                    reference_face: resizedSrc,
                    target_image: resizedTarget,
                    seed: 0,
                    randomize_seed: true,
                    num_inference_steps: 4,
                });

                let swappedUrl: string | null = null;
                for await (const msg of job) {
                    if (msg.type === "status") {
                        const s = msg as any;
                        if (s.queue_size > 0) {
                            setStatusMessage(`Queue: ${s.position ?? 1}/${s.queue_size}...`);
                            setProgress(Math.max(25, 55 - (((s.position ?? 1) / s.queue_size) * 30)));
                        } else {
                            setStatusMessage("Generating head swap...");
                            setProgress(70);
                        }
                    } else if (msg.type === "data") {
                        const msgData = (msg as any).data as any[];
                        const out = Array.isArray(msgData[0]) ? msgData[0][1] : msgData[0];
                        swappedUrl = out?.url ?? out?.path ?? null;
                        if (swappedUrl && !swappedUrl.startsWith("http")) {
                            swappedUrl = `https://linoyts-flux2-klein-face-swap.hf.space/gradio_api/file=${swappedUrl}`;
                        }
                    }
                }

                if (!swappedUrl) throw new Error("Result extraction failed.");
                setProgress(100);
                setResultImage(swappedUrl);
            }

        } catch (err: any) {
            console.error("Swap Error:", err);
            // Surface the real error so mobile users can understand what went wrong
            setError(err?.message || "Generation failed. Please try again with different images.");
        } finally {
            setIsGenerating(false);
            setStatusMessage("");
            setProgress(0);
        }
    };

    const handleDownload = async () => {
        if (!resultImage) return;
        try {
            const res = await fetch(resultImage);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `prompthub-${swapMode}-${Date.now()}.jpg`;
            link.click();
            URL.revokeObjectURL(url);
        } catch {
            window.open(resultImage, "_blank");
        }
    };

    return (
        <div className="faceswap-container">
            <Helmet>
                <title>Premium AI Face & Head Swap | PromptHub</title>
                <meta name="description" content="Professional AI face and head swapping with restoration. Free and unlimited." />
            </Helmet>

            <div className="premium-header">
                <h1>AI Swap Studio</h1>
                <p>High-fidelity face and head swapping with professional restoration.</p>
            </div>

            <div className="mode-selector-container">
                <div className="mode-selector">
                    <button
                        className={`mode-btn ${swapMode === 'face' ? 'active' : ''}`}
                        onClick={() => setSwapMode('face')}
                    >
                        <RefreshCcw size={18} />
                        <span>Face Swap</span>
                        <span className="pro-badge">PRO</span>
                    </button>
                    <button
                        className={`mode-btn ${swapMode === 'head' ? 'active' : ''}`}
                        onClick={() => {
                            if (swapMode !== 'head') setShowBetaModal(true);
                            setSwapMode('head');
                        }}
                    >
                        <User size={18} />
                        <span>Head Swap</span>
                        <span className="beta-badge">BETA</span>
                    </button>
                </div>
            </div>

            <div className="faceswap-content premium-card">
                <div className="builder-section">
                    <div className="upload-grid">
                        <div className="upload-box" onClick={() => originalInputRef.current?.click()}>
                            <div className="box-header">
                                <ImageIcon size={16} />
                                <label>Source Identity</label>
                            </div>
                            <div className="image-preview premium-preview">
                                {originalImage ? (
                                    <img src={originalImage} alt="Original" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <div className="icon-circle"><UserCircle size={32} /></div>
                                        <span>Pick Source Face</span>
                                        <p className="sub-text">The face you want to use</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={originalInputRef}
                                onChange={(e) => handleImageUpload(e, setOriginalImage, originalFileRef)}
                                accept="image/*" hidden />
                        </div>

                        <div className="upload-box" onClick={() => targetInputRef.current?.click()}>
                            <div className="box-header">
                                <TargetIcon size={16} />
                                <label>Target Scene</label>
                            </div>
                            <div className="image-preview premium-preview">
                                {targetImage ? (
                                    <img src={targetImage} alt="Target" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <div className="icon-circle"><ImageIcon size={32} /></div>
                                        <span>Pick Target Image</span>
                                        <p className="sub-text">Where the face will go</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={targetInputRef}
                                onChange={(e) => handleImageUpload(e, setTargetImage, targetFileRef)}
                                accept="image/*" hidden />
                        </div>
                    </div>
                </div>

                <div className="builder-actions premium-actions">
                    <button
                        onClick={handleGenerate}
                        className="builder-button premium-generate"
                        disabled={isGenerating || !originalImage || !targetImage}
                    >
                        {isGenerating ? (
                            <span className="loading-content">
                                <RefreshCcw className="spinning-icon" size={18} />
                                <span>{statusMessage || "Processing..."}</span>
                                {progress > 0 && <span className="progress-pct">{Math.round(progress)}%</span>}
                            </span>
                        ) : (
                            <span className="btn-content">
                                <Sparkles size={18} />
                                <span>Generate {swapMode === 'face' ? 'Face' : 'Head'} Swap</span>
                            </span>
                        )}
                    </button>
                    {(originalImage || targetImage) && (
                        <button
                            onClick={() => {
                                setOriginalImage(null); setTargetImage(null);
                                setResultImage(null);
                                originalFileRef.current = null; targetFileRef.current = null;
                            }}
                            className="builder-button-secondary premium-reset"
                            title="Reset all images"
                        >
                            <RefreshCcw size={18} />
                        </button>
                    )}
                </div>

                {error && (
                    <div className="error-message premium-error">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {resultImage && (
                    <div className="result-section premium-result">
                        <div className="result-header">
                            <CheckCircle2 size={24} className="success-icon" />
                            <h2 className="builder-label">Result Generated</h2>
                        </div>
                        <div className="result-preview premium-shadow">
                            <img src={resultImage} alt="Swapped Result" />
                            <button onClick={handleDownload} className="floating-download" title="Download Result">
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showBetaModal && (
                <div className="modal-overlay" onClick={() => setShowBetaModal(false)}>
                    <div className="modal-container premium-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <AlertCircle className="beta-icon" size={24} />
                            <h3>Head Swap (BETA)</h3>
                        </div>
                        <div className="modal-body">
                            <p>This feature is currently under active development. Generations may occasionally fail or produce unexpected results.</p>
                            <div className="pro-tip">
                                <Sparkles size={16} />
                                <span><strong>Best Results:</strong> Use clear, high-resolution portrait photos with good lighting.</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-btn" onClick={() => setShowBetaModal(false)}>Got it</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
