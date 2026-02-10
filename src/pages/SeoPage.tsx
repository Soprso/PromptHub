import { useParams, Navigate, Link } from "react-router-dom";
import { Copy, Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { seoPages } from "../data/seo-pages";
import { LikeButton } from "../components/LikeButton";

export default function SeoPage() {
    const { slug } = useParams<{ slug: string }>();
    const pageData = seoPages.find((p) => p.slug === slug);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    if (!pageData) {
        return <Navigate to="/" replace />;
    }

    const handleCopy = async (index: number, content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Helper to generate a consistent ID for the like button for these "static" prompts
    // We'll use "seo-[page-slug]-[index]" to ensure uniqueness
    const getPromptId = (index: number) => `seo-${pageData.slug}-${index}`;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "4rem" }}>
            <Helmet>
                <title>{pageData.metaTitle} | PromptHub</title>
                <meta name="description" content={pageData.metaDescription} />
                <link rel="canonical" href={`https://promptshub.shop/${pageData.slug}`} />
            </Helmet>

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
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Guide</span>
            </nav>

            {/* Header */}
            <header style={{ marginBottom: "3rem" }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    lineHeight: 1.2,
                    marginBottom: "1.5rem",
                    letterSpacing: "-0.02em"
                }}>
                    {pageData.title}
                </h1>
                <p style={{
                    fontSize: "1.125rem",
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                    maxWidth: "65ch"
                }}>
                    {pageData.intro}
                </p>
            </header>

            {/* Prompt List */}
            <div className="prompt-list">
                {pageData.prompts.map((prompt, index) => (
                    <article key={index} className="prompt-item" style={{ marginBottom: "3rem" }}>
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
                                <LikeButton promptSlug={getPromptId(index)} />
                                <button
                                    onClick={() => handleCopy(index, prompt.content)}
                                    aria-label="Copy prompt"
                                    style={{
                                        padding: "0.5rem",
                                        backgroundColor: copiedIndex === index ? "var(--success-color)" : "transparent",
                                        color: copiedIndex === index ? "#fff" : "var(--text-muted)",
                                        border: `1px solid ${copiedIndex === index ? "transparent" : "var(--border-color)"}`,
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
                                        if (copiedIndex !== index) {
                                            e.currentTarget.style.color = "var(--text-primary)";
                                            e.currentTarget.style.borderColor = "var(--text-secondary)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (copiedIndex !== index) {
                                            e.currentTarget.style.color = "var(--text-muted)";
                                            e.currentTarget.style.borderColor = "var(--border-color)";
                                        }
                                    }}
                                >
                                    {copiedIndex === index ? (
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

            {/* CTA */}
            <div style={{
                marginTop: "4rem",
                padding: "3rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "12px",
                textAlign: "center",
                border: "1px solid var(--border-color)"
            }}>
                <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "var(--text-primary)"
                }}>
                    Looking for more?
                </h3>
                <p style={{
                    marginBottom: "2rem",
                    color: "var(--text-secondary)",
                    fontSize: "1.125rem"
                }}>
                    {pageData.cta}
                </p>
                <Link
                    to="/"
                    style={{
                        display: "inline-block",
                        padding: "0.75rem 2rem",
                        backgroundColor: "var(--primary-color, #3b82f6)",
                        color: "white",
                        borderRadius: "8px",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                    Explore Prompt Library
                </Link>
            </div>
        </div >
    );
}
