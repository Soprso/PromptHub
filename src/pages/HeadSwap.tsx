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
    AlertCircle,
    Scissors,
} from "lucide-react";
import "./FaceSwap.css"; // reuse identical styles

// ─── Mobile detection ─────────────────────────────────────────────────────────
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const MAX_DIMENSION = isMobile ? 1024 : 1280;

// ─── blobToDataURL: FileReader-based (mobile-safe) ───────────────────────────
function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const timer = setTimeout(() => reject(new Error("Image read timeout — file may be too large.")), 15000);
        reader.onload = () => { clearTimeout(timer); resolve(reader.result as string); };
        reader.onerror = () => { clearTimeout(timer); reject(new Error("Could not read image. Try a JPG or PNG file.")); };
        reader.readAsDataURL(blob);
    });
}

// ─── loadImageFromDataURL ─────────────────────────────────────────────────────
function loadImageFromDataURL(dataURL: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => { img.src = ""; reject(new Error("Image decode timeout.")); }, 15000);
        img.onload = () => { clearTimeout(timer); resolve(img); };
        img.onerror = () => { clearTimeout(timer); reject(new Error("Image decode failed. Try a JPG or PNG file.")); };
        img.src = dataURL;
    });
}

// ─── resizeImage (desktop path) ──────────────────────────────────────────────
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

// ─── resizeFromDataURL (mobile path — avoids stale File handles) ──────────────
async function resizeFromDataURL(dataURL: string, filename = "image.jpg", maxDimension = MAX_DIMENSION): Promise<File> {
    const img = await loadImageFromDataURL(dataURL);
    const { width, height } = img;
    const scale = Math.min(maxDimension / width, maxDimension / height);
    if (width <= maxDimension && height <= maxDimension) {
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

// Removed resizeToMax512 as it is unused by Flux

// ─── applyColorMatch ─────────────────────────────────────────────────────────
function applyColorMatch(
    refinedCtx: CanvasRenderingContext2D,
    refinedW: number,
    refinedH: number,
    refImageData: ImageData
): void {
    const refined = refinedCtx.getImageData(0, 0, refinedW, refinedH);
    const refPx = refImageData.data;
    const rPx = refined.data;

    let rRef = 0, gRef = 0, bRef = 0;
    const refLen = refPx.length / 4;
    for (let i = 0; i < refPx.length; i += 4) {
        rRef += refPx[i]; gRef += refPx[i + 1]; bRef += refPx[i + 2];
    }
    rRef /= refLen; gRef /= refLen; bRef /= refLen;

    let rRfn = 0, gRfn = 0, bRfn = 0;
    const rfnLen = rPx.length / 4;
    for (let i = 0; i < rPx.length; i += 4) {
        rRfn += rPx[i]; gRfn += rPx[i + 1]; bRfn += rPx[i + 2];
    }
    rRfn /= rfnLen; gRfn /= rfnLen; bRfn /= rfnLen;

    const rAdj = Math.min(Math.max(rRef / (rRfn || 1), 0.7), 1.4);
    const gAdj = Math.min(Math.max(gRef / (gRfn || 1), 0.7), 1.4);
    const bAdj = Math.min(Math.max(bRef / (bRfn || 1), 0.7), 1.4);

    for (let i = 0; i < rPx.length; i += 4) {
        rPx[i] = Math.min(255, Math.max(0, rPx[i] * rAdj));
        rPx[i + 1] = Math.min(255, Math.max(0, rPx[i + 1] * gAdj));
        rPx[i + 2] = Math.min(255, Math.max(0, rPx[i + 2] * bAdj));
    }
    refinedCtx.putImageData(refined, 0, 0);
}

// ─── pasteWithFeather ─────────────────────────────────────────────────────────
function pasteWithFeather(
    fullCtx: CanvasRenderingContext2D,
    refinedCanvas: HTMLCanvasElement,
    cropX: number,
    cropY: number,
    cropW: number,
    cropH: number
): void {
    fullCtx.save();
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = cropW;
    maskCanvas.height = cropH;
    const maskCtx = maskCanvas.getContext("2d")!;
    const cx = cropW / 2, cy = cropH / 2;
    const rx = cropW / 2, ry = cropH / 2;
    const grad = maskCtx.createRadialGradient(cx, cy, Math.min(rx, ry) * 0.75, cx, cy, Math.max(rx, ry));
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    maskCtx.fillStyle = grad;
    maskCtx.fillRect(0, 0, cropW, cropH);

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = cropW;
    tempCanvas.height = cropH;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.drawImage(refinedCanvas, 0, 0, cropW, cropH);
    tempCtx.globalCompositeOperation = "destination-in";
    tempCtx.drawImage(maskCanvas, 0, 0);

    fullCtx.globalCompositeOperation = "source-over";
    fullCtx.drawImage(tempCanvas, cropX, cropY, cropW, cropH);
    fullCtx.restore();
}

// ─── applyEyePreservation ────────────────────────────────────────────────────
function applyEyePreservation(
    refinedCtx: CanvasRenderingContext2D,
    originalCropCanvas: HTMLCanvasElement,
    cropW: number,
    cropH: number
): void {
    const eyeX = Math.round(cropW * 0.2);
    const eyeY = Math.round(cropH * 0.15);
    const eyeW = Math.round(cropW * 0.6);
    const eyeH = Math.round(cropH * 0.25);

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = eyeW;
    maskCanvas.height = eyeH;
    const maskCtx = maskCanvas.getContext("2d")!;
    const mx = eyeW / 2, my = eyeH / 2;
    const maskGrad = maskCtx.createRadialGradient(mx, my, Math.min(mx, my) * 0.3, mx, my, Math.max(mx, my));
    maskGrad.addColorStop(0, "rgba(0,0,0,1)");
    maskGrad.addColorStop(0.7, "rgba(0,0,0,0.6)");
    maskGrad.addColorStop(1, "rgba(0,0,0,0)");
    maskCtx.fillStyle = maskGrad;
    maskCtx.fillRect(0, 0, eyeW, eyeH);

    const eyeCanvas = document.createElement("canvas");
    eyeCanvas.width = eyeW;
    eyeCanvas.height = eyeH;
    const eyeCtx = eyeCanvas.getContext("2d")!;
    eyeCtx.drawImage(originalCropCanvas, eyeX, eyeY, eyeW, eyeH, 0, 0, eyeW, eyeH);
    eyeCtx.globalCompositeOperation = "destination-in";
    eyeCtx.drawImage(maskCanvas, 0, 0);

    refinedCtx.save();
    refinedCtx.globalAlpha = 0.4;
    refinedCtx.globalCompositeOperation = "source-over";
    refinedCtx.drawImage(eyeCanvas, eyeX, eyeY);
    refinedCtx.restore();
}

// ─── runProPipeline: CodeFormer → GFPGANv1.4 → EyePreserve → ColorMatch → Feather
async function runProPipeline(
    swappedUrl: string,
    clientOptions: any,
    onProgress: (pct: number, msg: string) => void
): Promise<string> {
    const swapRes = await fetch(swappedUrl);
    const swapBlob = await swapRes.blob();
    const swapDataURL = await blobToDataURL(swapBlob);
    const bmp = await loadImageFromDataURL(swapDataURL);

    const fullW = bmp.width;
    const fullH = bmp.height;

    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = fullW;
    fullCanvas.height = fullH;
    const fullCtx = fullCanvas.getContext("2d")!;
    fullCtx.drawImage(bmp, 0, 0);

    const cropX = Math.round(fullW * 0.05);
    const cropY = 0;
    const cropW = Math.round(fullW * 0.90);
    const cropH = Math.round(fullH * 0.70);

    let refImageData: ImageData | null = null;
    try {
        refImageData = fullCtx.getImageData(cropX, cropY, cropW, cropH);
    } catch (secErr) {
        console.warn("getImageData blocked (CORS/taint) — color matching disabled:", secErr);
    }

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropW;
    cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext("2d")!;
    cropCtx.drawImage(bmp, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const cropBlob = await new Promise<Blob>((r) => cropCanvas.toBlob((b) => r(b!), "image/jpeg", 0.95));
    const cropFile = new File([cropBlob], "face_crop.jpg", { type: "image/jpeg" });

    // ── Stage Enhancement: CodeFormer (primary) ──────────────────────────────
    onProgress(75, "Enhancing face details...");
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
            const cfBlob = await (await fetch(cfUrl)).blob();
            cfFile = new File([cfBlob], "cf_enhanced.jpg", { type: "image/jpeg" });
        }
    } catch (cfErr: any) {
        console.warn("CodeFormer unavailable, trying GFPGANv1.4 fallback:", cfErr?.message);
        // ── Fallback: GFPGANv1.4 via MayankTamakuwala space ────────────────
        try {
            const gf2Client = await Client.connect(
                "MayankTamakuwala/Image-Upscaler-and-Restoring-GFPGAN-Algorithm",
                clientOptions
            );
            const gf2Result = await Promise.race([
                gf2Client.predict("/predict", [cropFile, "GFPGANv1.4", 2]),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error("GFPGANv1.4 fallback timeout")), 60000)
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
            console.warn("GFPGANv1.4 fallback also skipped, using raw swap:", gf2Err?.message);
        }
    }

    // ── Stage 4: Color Match + Eye Preserve ──────────────────────────────────
    onProgress(92, "Final blending and color matching...");
    const refinedDataURL = await blobToDataURL(cfFile);
    const refinedBmp = await loadImageFromDataURL(refinedDataURL);

    const refinedCanvas = document.createElement("canvas");
    refinedCanvas.width = cropW;
    refinedCanvas.height = cropH;
    const refinedCtx = refinedCanvas.getContext("2d")!;
    refinedCtx.drawImage(refinedBmp, 0, 0, cropW, cropH);

    onProgress(89, "Refining eye realism...");
    applyEyePreservation(refinedCtx, cropCanvas, cropW, cropH);

    if (refImageData) {
        applyColorMatch(refinedCtx, cropW, cropH, refImageData);
    }

    pasteWithFeather(fullCtx, refinedCanvas, cropX, cropY, cropW, cropH);

    return new Promise((resolve) => {
        fullCanvas.toBlob((b) => resolve(URL.createObjectURL(b!)), "image/jpeg", 0.98);
    });
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HeadSwap() {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [targetImage, setTargetImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const sourceInputRef = useRef<HTMLInputElement>(null);
    const targetInputRef = useRef<HTMLInputElement>(null);
    const sourceFileRef = useRef<File | null>(null);
    const targetFileRef = useRef<File | null>(null);

    // Pre-warm HF Spaces on mount to reduce cold start times
    useEffect(() => {
        fetch("https://tonyassi-face-swap.hf.space").catch(() => { });
        fetch("/api/hf/instantid/config").catch(() => { }); // primary head swap (ZeroGPU InstantID Proxied)
        fetch("https://laruss5-flux2-klein-face-swap.hf.space").catch(() => { }); // backup head swap
        fetch("https://sczhou-codeformer.hf.space").catch(() => { }); // enhancer
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
        if (!sourceFileRef.current || !targetFileRef.current) {
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

            // ── Stage 0: Resize ───────────────────────────────────────────────
            let resizedSrc: File;
            let resizedTarget: File;
            if (isMobile && sourceImage && targetImage) {
                resizedSrc = await resizeFromDataURL(sourceImage, sourceFileRef.current.name);
                resizedTarget = await resizeFromDataURL(targetImage, targetFileRef.current.name);
            } else {
                resizedSrc = await resizeImage(sourceFileRef.current);
                resizedTarget = await resizeImage(targetFileRef.current);
            }
            setProgress(15);

            // ── Stage 1: Flux Generative Head Swap (Face + Hair natively) ────────────
            // Uses 8 steps for better proportions. Includes automatic fallback space.

            async function runFluxSwap(spaceId: string, label: string): Promise<string> {
                setProgress(20);
                setStatusMessage(`Connecting to ${label}...`);
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
                                    setProgress(Math.max(20, 50 - ((pos / status.queue_size) * 30)));
                                    setStatusMessage(`Queue: ${pos}/${status.queue_size} (${label})...`);
                                } else if (status.stage === "processing") {
                                    setProgress(55);
                                    setStatusMessage(`Generating head swap (${label})...`);
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

            let fluxSwapUrl: string;
            try {
                fluxSwapUrl = await runFluxSwap("laruss5/Flux2-Klein-Face-Swap", "Primary Model");
            } catch (primaryErr: any) {
                console.warn("Primary Flux space failed, trying fallback:", primaryErr?.message ?? primaryErr);
                try {
                    fluxSwapUrl = await runFluxSwap("linoyts/Flux2-Klein-Face-Swap", "Backup Model");
                } catch (backupErr: any) {
                    console.error("Both Flux spaces failed:", backupErr);
                    throw new Error("Head Swap models are currently overloaded. Please try again in 1-2 minutes.");
                }
            }

            setProgress(65);

            // ── Stage 3–5: Pro pipeline (CodeFormer/GFPGANv1.4 → EyeBlend → ColorMatch → Feather)
            setStatusMessage("Enhancing and refining...");
            try {
                const finalImage = await runProPipeline(
                    fluxSwapUrl,
                    clientOptions,
                    (pct, msg) => { setProgress(pct); setStatusMessage(msg); }
                );
                setProgress(100);
                setResultImage(finalImage);
            } catch (pipeErr: any) {
                console.warn("Pro pipeline failed, using hair swap result:", pipeErr?.message);
                setProgress(100);
                setResultImage(fluxSwapUrl);
            }

        } catch (err: any) {
            console.error("Head Swap Error:", err);
            const errMsg = String(err?.message || err).toLowerCase();
            if (errMsg.includes("failed to fetch")) {
                setError("Network/VPN Error: Could not securely connect to the AI model. Please disable your VPN and try again.");
            } else {
                setError(err?.message || "Generation failed. Please try again with different images.");
            }
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
            link.download = `prompthub-headswap-${Date.now()}.jpg`;
            link.click();
            URL.revokeObjectURL(url);
        } catch {
            window.open(resultImage, "_blank");
        }
    };

    const handleReset = () => {
        setSourceImage(null);
        setTargetImage(null);
        setResultImage(null);
        setError(null);
        sourceFileRef.current = null;
        targetFileRef.current = null;
    };

    return (
        <div className="faceswap-container">
            <Helmet>
                <title>AI Head Swap | PromptHub</title>
                <meta name="description" content="AI-powered head swap with hair transfer. Free and unlimited." />
            </Helmet>

            <div className="premium-header">
                <h1>AI Head Swap Studio</h1>
                <p>Transfers the full head — face identity <em>and</em> hairstyle — onto any photo.</p>
            </div>

            {/* Info banner */}
            <div className="mode-selector-container">
                <div className="mode-selector" style={{ justifyContent: "center" }}>
                    <button
                        className="mode-btn active"
                        onClick={() => setShowInfoModal(true)}
                        style={{ cursor: "help" }}
                    >
                        <Scissors size={18} />
                        <span>Head Swap</span>
                        <span className="beta-badge">BETA</span>
                    </button>
                </div>
            </div>

            <div className="faceswap-content premium-card">
                <div className="builder-section">
                    <div className="upload-grid">

                        {/* Source image */}
                        <div className="upload-box" onClick={() => sourceInputRef.current?.click()}>
                            <div className="box-header">
                                <ImageIcon size={16} />
                                <label>Source Person</label>
                            </div>
                            <div className="image-preview premium-preview">
                                {sourceImage ? (
                                    <img src={sourceImage} alt="Source" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <div className="icon-circle"><UserCircle size={32} /></div>
                                        <span>Pick Source Face</span>
                                        <p className="sub-text">Face &amp; hair to transfer from</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={sourceInputRef}
                                onChange={(e) => handleImageUpload(e, setSourceImage, sourceFileRef)}
                                accept="image/*"
                                hidden
                            />
                        </div>

                        {/* Target image */}
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
                                        <p className="sub-text">Where the head will be placed</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={targetInputRef}
                                onChange={(e) => handleImageUpload(e, setTargetImage, targetFileRef)}
                                accept="image/*"
                                hidden
                            />
                        </div>

                    </div>
                </div>

                {/* Pipeline steps hint */}
                <div style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted, #888)", marginTop: "0.5rem", letterSpacing: "0.02em" }}>
                    <User size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />Face Swap →
                    <Scissors size={12} style={{ verticalAlign: "middle", margin: "0 4px" }} />Hair Transfer →
                    <Sparkles size={12} style={{ verticalAlign: "middle", margin: "0 4px" }} />Enhancement
                </div>

                <div className="builder-actions premium-actions">
                    <button
                        onClick={handleGenerate}
                        className="builder-button premium-generate"
                        disabled={isGenerating || !sourceImage || !targetImage}
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
                                <span>Generate Head Swap</span>
                            </span>
                        )}
                    </button>

                    {(sourceImage || targetImage) && (
                        <button
                            onClick={handleReset}
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
                            <h2 className="builder-label">Head Swap Complete</h2>
                        </div>
                        <div className="result-preview premium-shadow">
                            <img src={resultImage} alt="Head Swap Result" />
                            <button onClick={handleDownload} className="floating-download" title="Download Result">
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Modal */}
            {showInfoModal && (
                <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
                    <div className="modal-container premium-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <AlertCircle className="beta-icon" size={24} />
                            <h3>Head Swap (BETA) — How It Works</h3>
                        </div>
                        <div className="modal-body">
                            <p>Head Swap uses a <strong>three-step AI pipeline</strong>:</p>
                            <ol style={{ paddingLeft: "1.2rem", lineHeight: 1.8 }}>
                                <li><strong>Face Identity Swap</strong> — InsightFace copies the source face onto the target</li>
                                <li><strong>Hair Transfer</strong> — HairFastGAN transfers the source hairstyle &amp; color</li>
                                <li><strong>Enhancement</strong> — CodeFormer sharpens and restores facial details</li>
                            </ol>
                            <div className="pro-tip">
                                <Sparkles size={16} />
                                <span><strong>Best Results:</strong> Use clear, front-facing portrait photos with good lighting. Hair transfer works best when source and target have similar head orientations.</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-btn" onClick={() => setShowInfoModal(false)}>Got it</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
