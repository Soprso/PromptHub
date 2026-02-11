import { useState, useEffect } from 'react';
import { type SharedPrompt, communityApi } from '../lib/communityApi';
import { ThumbsUp, Copy, Check } from 'lucide-react';

const LIKED_PROMPTS_KEY = 'prompthub_liked_prompts';

// Helper to get liked prompts from localStorage
const getLikedPrompts = (): Set<string> => {
    try {
        const stored = localStorage.getItem(LIKED_PROMPTS_KEY);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
        return new Set();
    }
};

// Helper to save liked prompts to localStorage
const saveLikedPrompts = (likedSet: Set<string>) => {
    try {
        localStorage.setItem(LIKED_PROMPTS_KEY, JSON.stringify([...likedSet]));
    } catch (error) {
        console.error('Failed to save liked prompts:', error);
    }
};

export default function CommunityPromptCard({ prompt }: { prompt: SharedPrompt }) {
    const [likes, setLikes] = useState(prompt.like_count);
    const [hasLiked, setHasLiked] = useState(false);
    const [copied, setCopied] = useState(false);

    // Check if user has already liked this prompt on component mount
    useEffect(() => {
        const likedPrompts = getLikedPrompts();
        setHasLiked(likedPrompts.has(prompt.id));
    }, [prompt.id]);

    const handleLike = async () => {
        if (hasLiked) return;

        try {
            setHasLiked(true);
            setLikes(prev => prev + 1);

            // Save to localStorage
            const likedPrompts = getLikedPrompts();
            likedPrompts.add(prompt.id);
            saveLikedPrompts(likedPrompts);

            await communityApi.incrementLike(prompt.id);
        } catch (error) {
            console.error('Failed to increment like:', error);
            // Revert optimistic update on error
            setHasLiked(false);
            setLikes(prev => prev - 1);

            // Remove from localStorage
            const likedPrompts = getLikedPrompts();
            likedPrompts.delete(prompt.id);
            saveLikedPrompts(likedPrompts);

            alert('Failed to like prompt. Please try again.');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <article className="prompt-item" style={{ marginBottom: "3rem" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em"
                    }}>
                        {prompt.title}
                    </h2>

                    {/* Model + Time metadata */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{
                            fontSize: "0.75rem",
                            padding: "0.125rem 0.5rem",
                            borderRadius: "12px",
                            backgroundColor: "var(--bg-tertiary, #f3f4f6)",
                            color: "var(--accent-color)",
                            border: "1px solid var(--border-color)",
                            fontWeight: 500
                        }}>
                            {prompt.model}
                        </span>
                        <span style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)"
                        }}>
                            {timeAgo(prompt.created_at)}
                        </span>
                    </div>

                    {/* Tags */}
                    {prompt.tags && prompt.tags.length > 0 && (
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {prompt.tags.map((tag, i) => (
                                <span key={i} style={{
                                    fontSize: "0.75rem",
                                    padding: "0.125rem 0.5rem",
                                    borderRadius: "12px",
                                    backgroundColor: "var(--bg-tertiary, #f3f4f6)",
                                    color: "var(--text-secondary)",
                                    border: "1px solid var(--border-color)",
                                    fontWeight: 500
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Like & Copy buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", alignSelf: "flex-start" }}>
                    <button
                        onClick={handleLike}
                        disabled={hasLiked}
                        aria-label="Like prompt"
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
                        onMouseEnter={(e) => {
                            if (!hasLiked) {
                                e.currentTarget.style.color = "var(--text-primary)";
                                e.currentTarget.style.borderColor = "var(--text-secondary)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!hasLiked) {
                                e.currentTarget.style.color = "var(--text-muted)";
                                e.currentTarget.style.borderColor = "var(--border-color)";
                            }
                        }}
                    >
                        <ThumbsUp size={16} fill={hasLiked ? "currentColor" : "none"} />
                        <span style={{ fontSize: "0.75rem" }}>{likes}</span>
                    </button>

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
                        onMouseEnter={(e) => {
                            if (!copied) {
                                e.currentTarget.style.color = "var(--text-primary)";
                                e.currentTarget.style.borderColor = "var(--text-secondary)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!copied) {
                                e.currentTarget.style.color = "var(--text-muted)";
                                e.currentTarget.style.borderColor = "var(--border-color)";
                            }
                        }}
                    >
                        {copied ? (
                            <>
                                <Check size={16} />
                                <span style={{ fontSize: "0.75rem" }}>Copied</span>
                            </>
                        ) : (
                            <Copy size={16} />
                        )}
                    </button>
                </div>
            </div>

            {/* Content box */}
            <div style={{
                padding: "1.5rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                fontSize: "0.9375rem",
                lineHeight: "1.75",
                color: "var(--text-primary)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "inherit"
            }}>
                {prompt.content}
            </div>
        </article>
    );
}
