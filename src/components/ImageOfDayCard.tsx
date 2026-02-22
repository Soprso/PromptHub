import { useState, useEffect } from 'react';
import { ThumbsUp, Copy, Check } from 'lucide-react';
import { type ImageOfDay, imageOfDayApi } from '../lib/imageOfDayApi';
import ImageModal from './ImageModal';

const LIKED_IOD_KEY = 'prompthub_liked_iod';

const getLikedIODs = (): Set<string> => {
    try {
        const stored = localStorage.getItem(LIKED_IOD_KEY);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
        return new Set();
    }
};

const saveLikedIODs = (likedSet: Set<string>) => {
    try {
        localStorage.setItem(LIKED_IOD_KEY, JSON.stringify([...likedSet]));
    } catch (error) {
        console.error('Failed to save liked IODs:', error);
    }
};

export default function ImageOfDayCard({ item }: { item: ImageOfDay }) {
    const [likes, setLikes] = useState(item.likes || 0);
    const [hasLiked, setHasLiked] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const likedIODs = getLikedIODs();
        setHasLiked(likedIODs.has(item.id));
    }, [item.id]);

    const handleLike = async () => {
        if (hasLiked) return;

        try {
            setHasLiked(true);
            setLikes(prev => prev + 1);

            const likedIODs = getLikedIODs();
            likedIODs.add(item.id);
            saveLikedIODs(likedIODs);

            await imageOfDayApi.likeImageOfDay(item.id);
        } catch (error) {
            console.error('Failed to increment like:', error);
            setHasLiked(false);
            setLikes(prev => Math.max(0, prev - 1));

            const likedIODs = getLikedIODs();
            likedIODs.delete(item.id);
            saveLikedIODs(likedIODs);

            alert('Failed to like image of the day. Please try again.');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(item.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Extract a snippet for the alt text safely
    const altTextSnippet = item.prompt.slice(0, 100).replace(/\n/g, ' ') + (item.prompt.length > 100 ? '...' : '');

    return (
        <article className="prompt-item" style={{
            marginBottom: "3rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
        }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                alignItems: "stretch"
            }}>
                {/* Image Section */}
                <div
                    id={`iod-image-container-${item.id}`}
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        aspectRatio: "1/1",
                        width: "100%",
                        maxWidth: "500px",
                        margin: "0 auto",
                        cursor: "zoom-in",
                        transition: "transform 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.01)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    <img
                        id={`iod-image-${item.id}`}
                        src={item.image_url}
                        alt={`${altTextSnippet} AI generated prompt`}
                        loading="lazy"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                </div>

                {/* Prompt Section */}
                <div style={{
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "1rem"
                    }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.01em"
                        }}>
                            Today's Best AI Image & Prompt
                        </h2>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {/* Like Button */}
                            <button
                                onClick={handleLike}
                                disabled={hasLiked}
                                aria-label="Like image of the day"
                                style={{
                                    padding: "0.5rem",
                                    backgroundColor: hasLiked ? "var(--accent-color)" : "transparent",
                                    color: hasLiked ? "#fff" : "var(--text-muted)",
                                    border: `1px solid ${hasLiked ? "transparent" : "var(--border-color)"}`,
                                    borderRadius: "6px",
                                    cursor: hasLiked ? "not-allowed" : "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontFamily: "inherit"
                                }}
                            >
                                <ThumbsUp size={16} fill={hasLiked ? "currentColor" : "none"} />
                                <span style={{ fontSize: "0.75rem" }}>{likes}</span>
                            </button>

                            {/* Copy Button */}
                            <button
                                onClick={handleCopy}
                                aria-label="Copy prompt"
                                style={{
                                    padding: "0.5rem",
                                    backgroundColor: copied ? "var(--success-color)" : "transparent",
                                    color: copied ? "#fff" : "var(--text-muted)",
                                    border: `1px solid ${copied ? "transparent" : "var(--border-color)"}`,
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontFamily: "inherit"
                                }}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div style={{
                        flex: 1,
                        padding: "1.5rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        fontSize: "0.9375rem",
                        lineHeight: "1.75",
                        color: "var(--text-primary)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontFamily: "inherit",
                        overflowY: "auto",
                        maxHeight: "400px" // ensures it doesn't run infinitely long if prompt is huge
                    }}>
                        {item.prompt}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .prompt-item > div {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }
                    div[id^="iod-image-container-"] {
                        max-width: 100% !important;
                    }
                }
            `}</style>

            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageUrl={item.image_url}
                altText={altTextSnippet}
            />
        </article>
    );
}
