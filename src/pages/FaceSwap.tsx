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
        setProgress(10);
        setStatusMessage("Initializing...");

        try {
            const hfToken = import.meta.env.VITE_HUGGINGFACE_TOKEN;
            const clientOptions = hfToken ? { token: hfToken as `hf_${string}` } : {};

            if (swapMode === 'face') {
                setStatusMessage("Swapping faces...");
                setProgress(20);
                const swapClient = await Client.connect("tonyassi/face-swap", clientOptions);
                const swapResult = await swapClient.predict("/swap_faces", {
                    src_img: originalFileRef.current,
                    dest_img: targetFileRef.current,
                });

                setProgress(60);
                const data = swapResult.data as any[];
                const swappedOutput = data[0];
                const swappedUrl = swappedOutput?.url ?? swappedOutput?.path ?? null;
                if (!swappedUrl) throw new Error("Stage 1 failed: No image output.");

                const absoluteSwappedUrl = swappedUrl.startsWith("http")
                    ? swappedUrl
                    : `https://tonyassi-face-swap.hf.space/gradio_api/file=${swappedUrl}`;

                await performEnhancement(absoluteSwappedUrl, clientOptions);
            } else {
                setStatusMessage("Swapping head context...");
                setProgress(20);
                const swapClient = await Client.connect("linoyts/Flux2-Klein-Face-Swap", clientOptions);

                // Use submit for progress events on head swap
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
                            setStatusMessage(`Queue: ${s.position ?? 1}/${s.queue_size}...`);
                            setProgress(Math.max(20, 50 - (((s.position ?? 1) / s.queue_size) * 30)));
                        } else {
                            setStatusMessage("Generating head swap...");
                            setProgress(55);
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

                if (!swappedUrl) throw new Error("Result extraction failed.");
                setProgress(60);
                await performEnhancement(swappedUrl, clientOptions);
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

    const performEnhancement = async (swappedUrl: string, options: any) => {
        setStatusMessage("Polishing & sharpening...");
        setProgress(70);
        const imageRes = await fetch(swappedUrl);
        const imageBlob = await imageRes.blob();
        const intermediateFile = new File([imageBlob], "swapped.jpg", { type: "image/jpeg" });

        const enhanceClient = await Client.connect("sczhou/CodeFormer", options);

        // Use submit for progress on enhancement
        const job = enhanceClient.submit("/inference", {
            image: intermediateFile,
            face_align: true,
            background_enhance: true,
            face_upsample: true,
            upscale: 1,
            codeformer_fidelity: 0.5,
        });

        let finalOutput: any = null;
        for await (const msg of job) {
            if (msg.type === "status") {
                const s = msg as any;
                if (s.queue_size > 0) {
                    setStatusMessage(`Enhancing (queue: ${s.position ?? 1}/${s.queue_size})...`);
                    setProgress(Math.max(70, 85 - (((s.position ?? 1) / s.queue_size) * 15)));
                } else {
                    setStatusMessage("Enhancing face...");
                    setProgress(88);
                }
            } else if (msg.type === "data") {
                const data = (msg as any).data as any[];
                finalOutput = data[0];
            }
        }

        setProgress(100);
        setResultImage(finalOutput?.url ?? finalOutput?.path ?? null);
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
