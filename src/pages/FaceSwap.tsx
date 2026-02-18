import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Client } from "@gradio/client";
import "./FaceSwap.css";

export default function FaceSwap() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [targetImage, setTargetImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");

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
        setStatusMessage("Connecting to face swap server...");

        try {
            const hfToken = import.meta.env.VITE_HUGGINGFACE_TOKEN;

            // --- STAGE 1: FACE SWAP ---
            setStatusMessage("Stage 1/2: Swapping faces...");
            const swapClient = await Client.connect("tonyassi/face-swap", {
                token: hfToken as `hf_${string}`
            });
            const swapResult = await swapClient.predict("/swap_faces", {
                src_img: originalFileRef.current,
                dest_img: targetFileRef.current,
            });

            console.log("Stage 1 Result:", swapResult);
            const swappedOutput = (swapResult.data as any[])[0];
            const swappedUrl = swappedOutput?.url ?? swappedOutput?.path ?? null;
            if (!swappedUrl) throw new Error("Stage 1 failed: No image output from swap server.");

            // Standardize swappedUrl to absolute URL
            const absoluteSwappedUrl = swappedUrl.startsWith("http")
                ? swappedUrl
                : `https://tonyassi-face-swap.hf.space/gradio_api/file=${swappedUrl}`;

            // --- STAGE 2: ENHANCEMENT (CodeFormer) ---
            setStatusMessage("Stage 2/2: Enhancing quality (sharpening & blending)...");

            // DOWNLOAD the image from Stage 1 to pass as a clean File to Stage 2
            // This avoids "path not found" errors in the second space
            const imageRes = await fetch(absoluteSwappedUrl);
            if (!imageRes.ok) throw new Error("Failed to fetch intermediate image for enhancement.");
            const imageBlob = await imageRes.blob();
            const intermediateFile = new File([imageBlob], "swapped_face.jpg", { type: "image/jpeg" });

            const enhanceClient = await Client.connect("sczhou/CodeFormer", {
                token: hfToken as `hf_${string}`
            });
            const enhanceResult = await enhanceClient.predict("/inference", {
                image: intermediateFile,
                face_align: true,
                background_enhance: true,
                face_upsample: true,
                upscale: 1, // Keep original size to avoid long processing times
                codeformer_fidelity: 0.5,
            });

            console.log("Stage 2 Result:", enhanceResult);
            const finalOutput = (enhanceResult.data as any[])[0];
            const finalUrl = finalOutput?.url ?? finalOutput?.path ?? null;
            if (!finalUrl) throw new Error("Stage 2 failed: No image output from enhancement server.");

            setResultImage(finalUrl);

        } catch (err: any) {
            console.error("Swap Pipeline Error Detailed:", err);
            // Provide a more helpful error message
            const errMsg = err.message || "An unexpected error occurred.";
            setError(`Pipeline Failed: ${errMsg}. This can happen if a server is overloaded or the file is too large.`);
        } finally {
            setIsGenerating(false);
            setStatusMessage("");
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
            link.download = `faceswap-result-${Date.now()}.jpg`;
            link.click();
            URL.revokeObjectURL(url);
        } catch {
            window.open(resultImage, "_blank");
        }
    };

    return (
        <div className="faceswap-container">
            <Helmet>
                <title>Free Unlimited AI Face Swap | PromptHub</title>
                <meta name="description" content="Free AI face swap powered by InsightFace. No signup required." />
            </Helmet>

            <div className="builder-header">
                <h1>AI Face Swap (Pro Pipeline)</h1>
                <p>High-quality face swapping with AI-powered face restoration and sharpening.</p>
            </div>

            <div className="faceswap-content">
                <div className="builder-section">
                    <div className="upload-grid">
                        <div className="upload-box" onClick={() => originalInputRef.current?.click()}>
                            <label className="builder-label">Source Face (the face you want)</label>
                            <div className="image-preview">
                                {originalImage ? (
                                    <img src={originalImage} alt="Original" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                        </svg>
                                        <span>Upload Source Face</span>
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
                            <label className="builder-label">Target Image (where the face goes)</label>
                            <div className="image-preview">
                                {targetImage ? (
                                    <img src={targetImage} alt="Target" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 20a6 6 0 0 0-12 0" />
                                            <circle cx="12" cy="10" r="4" />
                                            <circle cx="12" cy="3" r="1" />
                                        </svg>
                                        <span>Upload Target Image</span>
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

                <div className="builder-actions">
                    <button
                        onClick={handleGenerate}
                        className="builder-button generate-button"
                        disabled={isGenerating || !originalImage || !targetImage}
                    >
                        {isGenerating ? (
                            <span className="loading-content">
                                <div className="spinner" />
                                {statusMessage || "Swapping Faces..."}
                            </span>
                        ) : "Generate Swap"}
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
                            className="builder-button builder-button-secondary"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}

                {isGenerating && (
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress-fill" />
                        </div>
                        <p className="progress-text">{statusMessage}</p>
                    </div>
                )}

                {resultImage && (
                    <div className="result-section">
                        <h2 className="builder-label">Result</h2>
                        <div className="result-preview">
                            <img src={resultImage} alt="Swapped Result" />
                        </div>
                        <div className="builder-actions">
                            <button onClick={handleDownload} className="builder-button">
                                Download Result
                            </button>
                        </div>
                        <div className="tech-details">
                            <h3>High-Quality Pipeline Details</h3>
                            <ul>
                                <li>Stage 1: <strong>InsightFace (inswapper_128)</strong> - Initial swap</li>
                                <li>Stage 2: <strong>CodeFormer</strong> - Face restoration & blending</li>
                                <li><strong>Cost: $0.00 (Free)</strong></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
