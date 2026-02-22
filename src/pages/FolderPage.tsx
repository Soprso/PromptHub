import { useParams, Link, Navigate } from "react-router-dom";
import { promptCategories } from "../data/prompts";
import { useState, lazy, Suspense } from "react";
import { getFolderIcon } from "../utils/iconMap";
import { Copy, Check, ChevronRight, Bot, Brain, Palette, Play } from "lucide-react";
import { LikeButton } from "../components/LikeButton";

const ComingSoonModal = lazy(() => import('../components/ComingSoonModal'));

export default function FolderPage() {
    const { categoryId, folderId } = useParams<{ categoryId: string; folderId: string }>();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [activeModalPrompt, setActiveModalPrompt] = useState<{ id: string, content: string } | null>(null);

    const category = promptCategories.find((cat) => cat.id === categoryId);
    const folder = category?.folders.find((f) => f.id === folderId);

    if (!category || !folder) {
        return <Navigate to="/" replace />;
    }

    const FolderIcon = getFolderIcon(folder.id);

    const handleCopy = async (promptId: string, content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(promptId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div>
            {/* Breadcrumbs */}
            <nav style={{
                marginBottom: "2rem",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-muted)",
                flexWrap: "wrap"
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
                <Link
                    to={`/category/${categoryId}`}
                    style={{
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                    {category.name}
                </Link>
                <ChevronRight size={14} />
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{folder.name}</span>
            </nav>

            <div style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                        padding: "0.75rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        color: "var(--text-primary)"
                    }}>
                        <FolderIcon size={28} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                            {folder.name}
                        </h1>
                        <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                            {folder.prompts.length} prompt{folder.prompts.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Documentation-style prompt list */}
            <div className="prompt-list">
                {folder.prompts.map((prompt) => (
                    <article key={prompt.id} className="prompt-item" style={{ marginBottom: "3rem" }}>
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
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", alignSelf: "flex-start" }}>
                                <LikeButton promptSlug={prompt.id} />
                                <button
                                    onClick={() => {
                                        window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt.content)}`, '_blank', 'noopener,noreferrer');
                                    }}
                                    aria-label="Open in ChatGPT"
                                    title="Open in ChatGPT"
                                    style={{
                                        padding: "0.5rem",
                                        backgroundColor: "transparent",
                                        color: "var(--text-muted)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "var(--text-primary)";
                                        e.currentTarget.style.borderColor = "var(--text-secondary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "var(--text-muted)";
                                        e.currentTarget.style.borderColor = "var(--border-color)";
                                    }}
                                >
                                    <Bot size={16} />
                                </button>

                                <button
                                    onClick={() => {
                                        window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt.content)}`, '_blank', 'noopener,noreferrer');
                                    }}
                                    aria-label="Open in Claude"
                                    title="Open in Claude"
                                    style={{
                                        padding: "0.5rem",
                                        backgroundColor: "transparent",
                                        color: "var(--text-muted)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "var(--text-primary)";
                                        e.currentTarget.style.borderColor = "var(--text-secondary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "var(--text-muted)";
                                        e.currentTarget.style.borderColor = "var(--border-color)";
                                    }}
                                >
                                    <Brain size={16} />
                                </button>

                                <button
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(prompt.content);
                                            window.open('https://discord.com/channels/@me', '_blank', 'noopener,noreferrer');
                                        } catch (err) {
                                            console.error("Failed to copy:", err);
                                        }
                                    }}
                                    aria-label="Open in Midjourney"
                                    title="Copy prompt and open Discord"
                                    style={{
                                        padding: "0.5rem",
                                        backgroundColor: "transparent",
                                        color: "var(--text-muted)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "var(--text-primary)";
                                        e.currentTarget.style.borderColor = "var(--text-secondary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "var(--text-muted)";
                                        e.currentTarget.style.borderColor = "var(--border-color)";
                                    }}
                                >
                                    <Palette size={16} />
                                </button>

                                <button
                                    onClick={() => handleCopy(prompt.id, prompt.content)}
                                    aria-label="Copy prompt"
                                    style={{
                                        padding: "0.5rem",
                                        backgroundColor: copiedId === prompt.id ? "var(--success-color)" : "transparent",
                                        color: copiedId === prompt.id ? "#fff" : "var(--text-muted)",
                                        border: `1px solid ${copiedId === prompt.id ? "transparent" : "var(--border-color)"}`,
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (copiedId !== prompt.id) {
                                            e.currentTarget.style.color = "var(--text-primary)";
                                            e.currentTarget.style.borderColor = "var(--text-secondary)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (copiedId !== prompt.id) {
                                            e.currentTarget.style.color = "var(--text-muted)";
                                            e.currentTarget.style.borderColor = "var(--border-color)";
                                        }
                                    }}
                                >
                                    {copiedId === prompt.id ? (
                                        <>
                                            <Check size={16} />
                                            <span style={{ fontSize: "0.75rem" }}>Copied</span>
                                        </>
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveModalPrompt({ id: prompt.id, content: prompt.content })}
                                    aria-label="Try this prompt (Coming Soon)"
                                    title="Try this prompt (Coming Soon)"
                                    style={{
                                        padding: "0.5rem",
                                        backgroundColor: "var(--primary-color, #3b82f6)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        boxShadow: "0 2px 4px -1px rgba(59, 130, 246, 0.2)",
                                        marginLeft: "4px"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(59, 130, 246, 0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 2px 4px -1px rgba(59, 130, 246, 0.2)";
                                    }}
                                >
                                    <Play size={16} fill="currentColor" />
                                </button>
                            </div>
                        </div>

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
                ))}
            </div>

            <Suspense fallback={null}>
                {activeModalPrompt && (
                    <ComingSoonModal
                        isOpen={!!activeModalPrompt}
                        promptContent={activeModalPrompt.content}
                        onClose={() => setActiveModalPrompt(null)}
                    />
                )}
            </Suspense>
        </div >
    );
}
