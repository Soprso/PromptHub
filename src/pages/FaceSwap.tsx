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

const MAX_DIMENSION = 1024; // Max pixels before sending to HF

// ─── Utility: Resize image to max dimension (canvas-based) ───────────────────
async function resizeImage(file: File, maxDimension = MAX_DIMENSION): Promise<File> {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            const { width, height } = img;
            if (width <= maxDimension && height <= maxDimension) {
                resolve(file); // already small enough
                return;
            }
            const scale = Math.min(maxDimension / width, maxDimension / height);
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                resolve(new File([blob!], file.name, { type: "image/jpeg" }));
            }, "image/jpeg", 0.92);
        };
        img.src = url;
    });
}

// ─── Utility: Simple face-region crop using brightness heuristic ─────────────
// Crops the center-upper portion of the image (a rough face region),
// enhances it with CodeFormer, then pastes it back.
async function cropFaceAndEnhance(
    swappedUrl: string,
    clientOptions: any,
    timeoutMs = 30000
): Promise<string> {
    // Download swapped image to canvas
    const res = await fetch(swappedUrl);
    const blob = await res.blob();
    const bmp = await createImageBitmap(blob);

    const fullW = bmp.width;
    const fullH = bmp.height;

    // Face region: wider + taller crop for full facial context
    const cropX = Math.round(fullW * 0.05);
    const cropY = 0;
    const cropW = Math.round(fullW * 0.90);
    const cropH = Math.round(fullH * 0.70);

    // Draw face crop to a canvas
    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropW;
    cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext("2d")!;
    cropCtx.drawImage(bmp, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const cropBlob = await new Promise<Blob>((r) => cropCanvas.toBlob((b) => r(b!), "image/jpeg", 0.92));
    const cropFile = new File([cropBlob], "face_crop.jpg", { type: "image/jpeg" });

    // Run CodeFormer on crop only
    const enhanceClient = await Client.connect("sczhou/CodeFormer", clientOptions);
    const enhanceResult = await Promise.race([
        enhanceClient.predict("/inference", {
            image: cropFile,
            face_align: true,
            background_enhance: false,
            face_upsample: true,
            upscale: 2,               // 2× upscale for sharper output
            codeformer_fidelity: 0.7, // high fidelity = maximum quality
        }),
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("CodeFormer timeout")), timeoutMs)
        ),
    ]);

    const enhData = (enhanceResult as any).data as any[];
    const enhancedOutput = enhData[0];
    const enhancedUrl: string = enhancedOutput?.url ?? enhancedOutput?.path ?? null;
    if (!enhancedUrl) throw new Error("No enhanced output");

    // Download enhanced crop
    const enhRes = await fetch(enhancedUrl.startsWith("http")
        ? enhancedUrl
        : `https://sczhou-codeformer.hf.space/gradio_api/file=${enhancedUrl}`
    );
    const enhBlob = await enhRes.blob();
    const enhBmp = await createImageBitmap(enhBlob);

    // Paste enhanced crop back onto full image
    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = fullW;
    fullCanvas.height = fullH;
    const fullCtx = fullCanvas.getContext("2d")!;
    fullCtx.drawImage(bmp, 0, 0); // draw original full image
    fullCtx.drawImage(enhBmp, cropX, cropY, cropW, cropH); // paste enhanced crop back

    return new Promise((resolve) => {
        fullCanvas.toBlob((b) => {
            const finalUrl = URL.createObjectURL(b!);
            resolve(finalUrl);
        }, "image/jpeg", 0.98); // maximum quality, minimal compression
    });
}

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

    // ── Fix 1: Pre-warm HF Spaces on page load ──
    useEffect(() => {
        // Silently ping both spaces to wake their GPU before user clicks Generate
        fetch("https://tonyassi-face-swap.hf.space").catch(() => { });
        fetch("https://sczhou-codeformer.hf.space").catch(() => { });
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

            // ── Fix 2: Pre-resize both images to max 1024px ──
            const [resizedSrc, resizedTarget] = await Promise.all([
                resizeImage(originalFileRef.current),
                resizeImage(targetFileRef.current),
            ]);
            setProgress(20);

            if (swapMode === 'face') {
                // Stage 1: InsightFace swap
                setStatusMessage("Swapping faces...");
                setProgress(30);
                const swapClient = await Client.connect("tonyassi/face-swap", clientOptions);
                const swapResult = await swapClient.predict("/swap_faces", {
                    src_img: resizedSrc,
                    dest_img: resizedTarget,
                });

                setProgress(60);
                const data = swapResult.data as any[];
                const swappedOutput = data[0];
                const swappedUrl = swappedOutput?.url ?? swappedOutput?.path ?? null;
                if (!swappedUrl) throw new Error("No image output from swap model.");

                const absoluteSwappedUrl = swappedUrl.startsWith("http")
                    ? swappedUrl
                    : `https://tonyassi-face-swap.hf.space/gradio_api/file=${swappedUrl}`;

                // Stage 2: CodeFormer on face crop only, 60s timeout, fallback to raw
                setStatusMessage("Enhancing face quality...");
                setProgress(72);
                try {
                    const enhanced = await cropFaceAndEnhance(absoluteSwappedUrl, clientOptions, 60000);
                    setProgress(100);
                    setResultImage(enhanced);
                } catch (enhErr: any) {
                    console.warn("Enhancement skipped:", enhErr?.message);
                    setProgress(100);
                    setResultImage(absoluteSwappedUrl);
                }

            } else {
                // Head Swap mode
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
            setError("Generation failed. Please try again with different images.");
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
                                        <div className="icon-circle">
                                            <UserCircle size={32} />
                                        </div>
                                        <span>Pick Source Face</span>
                                        <p className="sub-text">The face you want to use</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={originalInputRef}
                                onChange={(e) => handleImageUpload(e, setOriginalImage, originalFileRef)}
                                accept="image/*"
                                hidden
                            />
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
                                        <div className="icon-circle">
                                            <ImageIcon size={32} />
                                        </div>
                                        <span>Pick Target Image</span>
                                        <p className="sub-text">Where the face will go</p>
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
                                setOriginalImage(null);
                                setTargetImage(null);
                                setResultImage(null);
                                originalFileRef.current = null;
                                targetFileRef.current = null;
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

            {/* BETA Modal */}
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
                            <button className="modal-btn" onClick={() => setShowBetaModal(false)}>
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
