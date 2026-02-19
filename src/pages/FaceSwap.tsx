import { useState, useRef } from "react";
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

// Client-side color matching: transfer color tone from target to swapped result
async function applyColorMatch(swappedDataUrl: string, referenceDataUrl: string): Promise<string> {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(swappedDataUrl); return; }

        const swappedImg = new Image();
        swappedImg.crossOrigin = "anonymous";
        swappedImg.onload = () => {
            canvas.width = swappedImg.width;
            canvas.height = swappedImg.height;
            ctx.drawImage(swappedImg, 0, 0);

            const refImg = new Image();
            refImg.crossOrigin = "anonymous";
            refImg.onload = () => {
                // Get mean color stats from reference target image
                const refCanvas = document.createElement("canvas");
                const refCtx = refCanvas.getContext("2d");
                if (!refCtx) { resolve(swappedDataUrl); return; }
                refCanvas.width = refImg.width;
                refCanvas.height = refImg.height;
                refCtx.drawImage(refImg, 0, 0);

                const refData = refCtx.getImageData(0, 0, refCanvas.width, refCanvas.height).data;
                const swappedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = swappedData.data;

                let [rRef, gRef, bRef, rSwap, gSwap, bSwap, count] = [0, 0, 0, 0, 0, 0, 0];
                for (let i = 0; i < refData.length; i += 4) {
                    rRef += refData[i]; gRef += refData[i + 1]; bRef += refData[i + 2];
                    count++;
                }
                for (let i = 0; i < pixels.length; i += 4) {
                    rSwap += pixels[i]; gSwap += pixels[i + 1]; bSwap += pixels[i + 2];
                }
                const n = count;
                const m = pixels.length / 4;
                const [rMeanRef, gMeanRef, bMeanRef] = [rRef / n, gRef / n, bRef / n];
                const [rMeanSwap, gMeanSwap, bMeanSwap] = [rSwap / m, gSwap / m, bSwap / m];

                // Subtle shift: blend 20% toward target color tone
                const blend = 0.2;
                const rShift = (rMeanRef - rMeanSwap) * blend;
                const gShift = (gMeanRef - gMeanSwap) * blend;
                const bShift = (bMeanRef - bMeanSwap) * blend;

                for (let i = 0; i < pixels.length; i += 4) {
                    pixels[i] = Math.min(255, Math.max(0, pixels[i] + rShift));
                    pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + gShift));
                    pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + bShift));
                }
                ctx.putImageData(swappedData, 0, 0);
                resolve(canvas.toDataURL("image/jpeg", 0.95));
            };
            refImg.onerror = () => resolve(swappedDataUrl);
            refImg.src = referenceDataUrl;
        };
        swappedImg.onerror = () => resolve(swappedDataUrl);
        swappedImg.src = swappedDataUrl;
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
        setProgress(0);
        setStatusMessage("Connecting...");

        const hfToken = import.meta.env.VITE_HUGGINGFACE_TOKEN;
        const clientOptions = hfToken ? { token: hfToken as `hf_${string}`, events: ["data", "status"] as ("data" | "status")[] } : { events: ["data", "status"] as ("data" | "status")[] };

        try {
            if (swapMode === 'face') {
                // Stage 1: Face Swap + Enhance in one call (SS86910/Faceswaper uses FaceFusion + CodeFormer internally)
                setStatusMessage("Swapping faces...");
                setProgress(10);
                const swapClient = await Client.connect("SS86910/Faceswaper", clientOptions);
                const job = swapClient.submit("/predict", {
                    source_image_path: originalFileRef.current,
                    target_image_path: targetFileRef.current,
                    enhance_face: true,
                });

                let swappedUrl: string | null = null;
                for await (const msg of job) {
                    if (msg.type === "status") {
                        const s = msg as any;
                        if (s.queue_size > 0) {
                            setStatusMessage(`Queue: ${s.position}/${s.queue_size}...`);
                            const queueProgress = Math.max(10, 50 - (s.position / s.queue_size) * 40);
                            setProgress(queueProgress);
                        } else {
                            setStatusMessage("Swapping faces...");
                            setProgress(60);
                        }
                    } else if (msg.type === "data") {
                        const data = (msg as any).data as any[];
                        const out = data[0];
                        swappedUrl = out?.url ?? out?.path ?? null;
                        if (swappedUrl && !swappedUrl.startsWith("http")) {
                            swappedUrl = `https://ss86910-faceswaper.hf.space/gradio_api/file=${swappedUrl}`;
                        }
                    }
                }

                if (!swappedUrl) throw new Error("No output from swap model.");

                // Stage 2: Color Match (client-side, fast)
                setStatusMessage("Matching colors...");
                setProgress(80);
                const swappedRes = await fetch(swappedUrl);
                const swappedBlob = await swappedRes.blob();
                const swappedDataUrl = await new Promise<string>((res) => {
                    const r = new FileReader();
                    r.onloadend = () => res(r.result as string);
                    r.readAsDataURL(swappedBlob);
                });

                const colorMatched = await applyColorMatch(swappedDataUrl, targetImage!);
                setProgress(100);
                setStatusMessage("Done!");
                setResultImage(colorMatched);

            } else {
                // Head Swap mode
                setStatusMessage("Swapping head...");
                setProgress(10);
                const swapClient = await Client.connect("linoyts/Flux2-Klein-Face-Swap", clientOptions);
                const job = swapClient.submit("/face_swap", {
                    reference_face: originalFileRef.current,
                    target_image: targetFileRef.current,
                    seed: 0,
                    randomize_seed: true,
                    num_inference_steps: 4,
                });

                let swappedUrl: string | null = null;
                for await (const msg of job) {
                    if (msg.type === "status") {
                        const s = msg as any;
                        if (s.queue_size > 0) {
                            setStatusMessage(`Queue: ${s.position}/${s.queue_size}...`);
                            const queueProgress = Math.max(10, 50 - (s.position / s.queue_size) * 40);
                            setProgress(queueProgress);
                        } else {
                            setStatusMessage("Generating...");
                            setProgress(60);
                        }
                    } else if (msg.type === "data") {
                        const data = (msg as any).data as any[];
                        const out = Array.isArray(data[0]) ? data[0][1] : data[0];
                        swappedUrl = out?.url ?? out?.path ?? null;
                        if (swappedUrl && !swappedUrl.startsWith("http")) {
                            swappedUrl = `https://linoyts-flux2-klein-face-swap.hf.space/gradio_api/file=${swappedUrl}`;
                        }
                    }
                }

                if (!swappedUrl) throw new Error("No output from head swap model.");

                // Polishing step with CodeFormer
                setStatusMessage("Polishing & sharpening...");
                setProgress(75);
                const imageRes = await fetch(swappedUrl);
                const imageBlob = await imageRes.blob();
                const intermediateFile = new File([imageBlob], "swapped.jpg", { type: "image/jpeg" });

                const enhanceClient = await Client.connect("sczhou/CodeFormer", { events: ["data", "status"] as ("data" | "status")[], ...(hfToken ? { token: hfToken as `hf_${string}` } : {}) });
                const enhanceJob = enhanceClient.submit("/inference", {
                    image: intermediateFile,
                    face_align: true,
                    background_enhance: true,
                    face_upsample: true,
                    upscale: 1,
                    codeformer_fidelity: 0.5,
                });

                let finalUrl: string | null = null;
                for await (const msg of enhanceJob) {
                    if (msg.type === "status") {
                        setProgress(85);
                    } else if (msg.type === "data") {
                        const data = (msg as any).data as any[];
                        const out = data[0];
                        finalUrl = out?.url ?? out?.path ?? null;
                    }
                }

                setProgress(100);
                setResultImage(finalUrl);
            }

        } catch (err: any) {
            console.error("Swap Error:", err);
            setError("Generation failed. Try different images or try again later.");
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
                            if (swapMode !== 'head') {
                                setShowBetaModal(true);
                            }
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
