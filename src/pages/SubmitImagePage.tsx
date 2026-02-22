import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, Upload, Check, AlertCircle } from 'lucide-react';
import { imageOfDayApi } from '../lib/imageOfDayApi';

export default function SubmitImagePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [likes, setLikes] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        if (!selectedFile || !prompt.trim()) {
            setError('Image File and Prompt are required.');
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Upload Image to Storage
            const { url: uploadedUrl, error: uploadError } = await imageOfDayApi.uploadImage(selectedFile);

            if (uploadError || !uploadedUrl) {
                const detailedError = uploadError?.message || uploadError || 'Unknown storage error';
                setError(`Upload Failed: ${detailedError}. Make sure the bucket "image_of_day" exists and has public upload policies.`);
                setIsSubmitting(false);
                return;
            }

            // 2. Insert into DB
            const success = await imageOfDayApi.insertImageOfDay({
                image_url: uploadedUrl,
                prompt,
                likes: Number(likes)
            });

            if (success) {
                setSuccess('Image of the Day added successfully');
                setSelectedFile(null);
                setPreviewUrl(null);
                setPrompt('');
                setLikes(0);
            } else {
                setError('Failed to submit entry to database.');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Submit Image of the Day | PromptHub Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Breadcrumbs */}
            <nav style={{
                marginBottom: "2rem",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-muted)"
            }}>
                <Link
                    to="/"
                    style={{
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                    Home
                </Link>
                <ChevronRight size={14} />
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Submit Image</span>
            </nav>

            <div style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div style={{
                        padding: "0.75rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        color: "var(--text-primary)"
                    }}>
                        <Upload size={28} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        Submit Image of the Day
                    </h1>
                </div>
                <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "800px" }}>
                    Manually add a new AI image and prompt to the daily featured list.
                </p>
            </div>

            <div style={{ maxWidth: "800px" }}>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        backgroundColor: "var(--bg-primary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        padding: "2rem"
                    }}
                >
                    <h2 style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        marginBottom: "1.5rem",
                        color: "var(--text-primary)"
                    }}>
                        Information
                    </h2>

                    {error && (
                        <div style={{
                            marginBottom: "1.5rem",
                            padding: "1rem",
                            backgroundColor: "#FEE2E2",
                            color: "#991B1B",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            border: "1px solid #FECACA",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            marginBottom: "1.5rem",
                            padding: "1rem",
                            backgroundColor: "#D1FAE5",
                            color: "#065F46",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            border: "1px solid #A7F3D0",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <Check size={16} />
                            {success}
                        </div>
                    )}

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{
                            display: "block",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            marginBottom: "0.5rem",
                            color: "var(--text-primary)"
                        }}>
                            Featured Image <span style={{ color: "#DC2626" }}>*</span>
                        </label>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem"
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                                style={{
                                    fontSize: "0.875rem",
                                    color: "var(--text-primary)"
                                }}
                            />

                            {previewUrl && (
                                <div style={{
                                    width: "100%",
                                    maxHeight: "300px",
                                    overflow: "hidden",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border-color)",
                                    backgroundColor: "var(--bg-secondary)"
                                }}>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{
                            display: "block",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            marginBottom: "0.5rem",
                            color: "var(--text-primary)"
                        }}>
                            Prompt Content <span style={{ color: "#DC2626" }}>*</span>
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter the exact prompt used..."
                            rows={6}
                            required
                            style={{
                                width: "100%",
                                padding: "0.625rem 0.875rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "6px",
                                backgroundColor: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                fontSize: "0.875rem",
                                fontFamily: "inherit",
                                transition: "border-color 0.2s",
                                outline: "none",
                                resize: "vertical"
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent-color)"}
                            onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                        />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{
                            display: "block",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            marginBottom: "0.5rem",
                            color: "var(--text-primary)"
                        }}>
                            Initial Likes
                        </label>
                        <input
                            type="number"
                            value={likes}
                            onChange={(e) => setLikes(Number(e.target.value))}
                            style={{
                                width: "100%",
                                padding: "0.625rem 0.875rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "6px",
                                backgroundColor: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                fontSize: "0.875rem",
                                fontFamily: "inherit",
                                transition: "border-color 0.2s",
                                outline: "none"
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent-color)"}
                            onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: isSubmitting ? "var(--bg-secondary)" : "var(--accent-color)",
                            color: isSubmitting ? "var(--text-muted)" : "#FFFFFF",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            fontFamily: "inherit"
                        }}
                    >
                        {isSubmitting ? 'Uploading & Submitting...' : 'Submit Image of the Day'}
                    </button>
                </form>
            </div>
        </>
    );
}
