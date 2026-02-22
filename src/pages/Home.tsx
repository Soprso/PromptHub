import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, BookOpen, Search, Palette, PenTool, Code2, Sparkles, ChevronRight, Check, ThumbsUp, Bot, Brain } from "lucide-react";
import { seoPages } from "../data/seo-pages";
import { communityApi, type SharedPrompt } from "../lib/communityApi";
import { useEffect, useState } from "react";

export default function Home() {
    const [communityPicks, setCommunityPicks] = useState<SharedPrompt[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        async function loadCommunityPicks() {
            try {
                const response = await communityApi.getPrompts(1, 5);
                // Sort by like_count descending to get top 5
                const sorted = response.prompts.sort((a, b) => b.like_count - a.like_count);
                setCommunityPicks(sorted.slice(0, 5));
            } catch (error) {
                console.error('Failed to load community picks:', error);
            }
        }
        loadCommunityPicks();
    }, []);

    const handleCopy = (prompt: SharedPrompt) => {
        navigator.clipboard.writeText(prompt.content);
        setCopiedId(prompt.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div>
            <Helmet>
                <title>Free AI Prompts Library – ChatGPT, Midjourney, DALL·E & More | PromptHub</title>
                <meta name="description" content="Browse 2,070+ free AI prompts for ChatGPT, Midjourney, DALL·E, Claude and more. Copy ready-to-use prompts for art, coding, writing, marketing and design instantly. No login required." />
                <meta property="og:title" content="PromptHub – 2,070+ Free AI Prompts" />
                <meta property="og:description" content="Free copy-paste AI prompts for ChatGPT, Midjourney & DALL·E. No signup. Just use." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://promptshub.shop" />
                <link rel="canonical" href="https://promptshub.shop" />
            </Helmet>
            <div style={{ marginBottom: "2.5rem", maxWidth: "800px" }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: "1.2"
                }}>
                    Internet's Best Collection of <span style={{ color: "var(--accent-color)" }}>Free AI </span> Prompts
                </h1>
                <p style={{
                    color: "var(--text-secondary)",
                    fontSize: "1.125rem",
                    lineHeight: "1.75",
                    marginBottom: "2rem"
                }}>
                    Access 2,000+ curated prompts for coding, design, and content creation. Optimized for ChatGPT, Claude, and Midjourney. No signup required.
                </p>
            </div>

            <div style={{
                backgroundColor: "var(--bg-secondary)",
                padding: "2rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                marginBottom: "3rem"
            }}>
                <h2 style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    marginBottom: "1.25rem",
                    color: "var(--text-primary)"
                }}>
                    Streamline Your Workflow
                </h2>
                <ul style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem"
                }}>
                    <li style={{ display: "flex", alignItems: "start", gap: "0.875rem" }}>
                        <span style={{ color: "var(--accent-color)", marginTop: "0.25rem" }}><BookOpen size={20} /></span>
                        <span style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Explore Stacks</strong> — Navigate specialized categories for developers and designers
                        </span>
                    </li>
                    <li style={{ display: "flex", alignItems: "start", gap: "0.875rem" }}>
                        <span style={{ color: "var(--accent-color)", marginTop: "0.25rem" }}><Search size={20} /></span>
                        <span style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Search Instantly</strong> — Find specific solutions in seconds without the fluff
                        </span>
                    </li>
                    <li style={{ display: "flex", alignItems: "start", gap: "0.875rem" }}>
                        <span style={{ color: "var(--accent-color)", marginTop: "0.25rem" }}><Copy size={20} /></span>
                        <span style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Copy & Ship</strong> — One-click copy formatted for immediate use
                        </span>
                    </li>
                </ul>
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h2 style={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    marginBottom: "1.5rem",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                }}>
                    <Sparkles size={24} style={{ color: "var(--accent-color)" }} />
                    Featured Guides
                </h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1rem"
                }}>
                    {seoPages.map((page) => (
                        <Link key={page.slug} to={`/${page.slug}`} style={{ textDecoration: "none" }}>
                            <div style={{
                                padding: "1.5rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "8px",
                                backgroundColor: "var(--bg-secondary)",
                                transition: "all 0.2s ease",
                                height: "100%",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column"
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "var(--accent-color)";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <div style={{
                                    fontWeight: 600,
                                    color: "var(--text-primary)",
                                    marginBottom: "0.5rem",
                                    fontSize: "1.125rem"
                                }}>
                                    {page.title}
                                </div>
                                <div style={{
                                    fontSize: "0.875rem",
                                    color: "var(--text-secondary)",
                                    lineHeight: "1.6",
                                    flex: 1
                                }}>
                                    {page.metaDescription}
                                </div>
                                <div style={{
                                    marginTop: "1rem",
                                    fontSize: "0.875rem",
                                    color: "var(--accent-color)",
                                    fontWeight: 500,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem"
                                }}>
                                    Read Guide <ChevronRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Community Picks Section */}
            {communityPicks.length > 0 && (
                <div style={{ marginBottom: "3rem" }}>
                    <h2 style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        marginBottom: "1.5rem",
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}>
                        🔥 Community Picks
                    </h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1rem"
                    }}>
                        {communityPicks.map((prompt) => (
                            <div key={prompt.id} style={{
                                padding: "1.5rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "8px",
                                backgroundColor: "var(--bg-secondary)",
                                transition: "all 0.2s ease",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <div style={{
                                    fontWeight: 600,
                                    color: "var(--text-primary)",
                                    marginBottom: "0.5rem",
                                    fontSize: "1.125rem"
                                }}>
                                    {prompt.title}
                                </div>
                                <div style={{
                                    fontSize: "0.875rem",
                                    color: "var(--text-secondary)",
                                    lineHeight: "1.6",
                                    flex: 1,
                                    marginBottom: "1rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical"
                                }}>
                                    {prompt.content}
                                </div>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "0.5rem"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.375rem",
                                        fontSize: "0.75rem",
                                        color: "var(--text-muted)"
                                    }}>
                                        <ThumbsUp size={14} fill="var(--text-muted)" />
                                        <span>{prompt.like_count}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt.content)}`, '_blank', 'noopener,noreferrer');
                                        }}
                                        aria-label="Open in ChatGPT"
                                        title="Open in ChatGPT"
                                        style={{
                                            padding: "0.375rem 0.75rem",
                                            backgroundColor: "transparent",
                                            color: "var(--text-muted)",
                                            border: "1px solid var(--border-color)",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "0.75rem",
                                            fontWeight: 500,
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.375rem",
                                            fontFamily: "inherit"
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
                                        <Bot size={12} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt.content)}`, '_blank', 'noopener,noreferrer');
                                        }}
                                        aria-label="Open in Claude"
                                        title="Open in Claude"
                                        style={{
                                            padding: "0.375rem 0.75rem",
                                            backgroundColor: "transparent",
                                            color: "var(--text-muted)",
                                            border: "1px solid var(--border-color)",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "0.75rem",
                                            fontWeight: 500,
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.375rem",
                                            fontFamily: "inherit"
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
                                        <Brain size={12} />
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
                                            padding: "0.375rem 0.75rem",
                                            backgroundColor: "transparent",
                                            color: "var(--text-muted)",
                                            border: "1px solid var(--border-color)",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "0.75rem",
                                            fontWeight: 500,
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.375rem",
                                            fontFamily: "inherit"
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
                                        <Palette size={12} />
                                    </button>

                                    <button
                                        onClick={() => handleCopy(prompt)}
                                        style={{
                                            padding: "0.375rem 0.75rem",
                                            backgroundColor: copiedId === prompt.id ? "var(--success-color)" : "transparent",
                                            color: copiedId === prompt.id ? "#fff" : "var(--text-muted)",
                                            border: `1px solid ${copiedId === prompt.id ? "transparent" : "var(--border-color)"}`,
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "0.75rem",
                                            fontWeight: 500,
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.375rem",
                                            fontFamily: "inherit"
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
                                                <Check size={12} />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={12} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        marginTop: "1.5rem",
                        textAlign: "center"
                    }}>
                        <Link
                            to="/community"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                color: "var(--accent-color)",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "0.875rem"
                            }}
                        >
                            View All Community Prompts <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            )}

            <div>
                <h2 style={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    marginBottom: "1.5rem",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em"
                }}>
                    Popular AI Prompt Categories
                </h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "1rem"
                }}>
                    <Link to="/category/ai-image-generation" style={{ textDecoration: "none" }}>
                        <div style={{
                            padding: "1.25rem",
                            border: "1px solid var(--border-color)",
                            borderRadius: "8px",
                            backgroundColor: "var(--bg-secondary)",
                            transition: "all 0.2s ease",
                            height: "100%",
                            cursor: "pointer"
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--accent-color)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border-color)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            <div style={{ marginBottom: "1rem", color: "var(--accent-color)" }}><Palette size={32} /></div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>AI Image Generation Prompts</div>
                            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                                Free prompts for Midjourney, DALL·E, Stable Diffusion
                            </div>
                        </div>
                    </Link>
                    <Link to="/category/writing" style={{ textDecoration: "none" }}>
                        <div style={{
                            padding: "1.25rem",
                            border: "1px solid var(--border-color)",
                            borderRadius: "8px",
                            backgroundColor: "var(--bg-secondary)",
                            transition: "all 0.2s ease",
                            height: "100%",
                            cursor: "pointer"
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--accent-color)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border-color)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            <div style={{ marginBottom: "1rem", color: "var(--accent-color)" }}><PenTool size={32} /></div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>Writing & Content Prompts</div>
                            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                                Free ChatGPT prompts for writing and content
                            </div>
                        </div>
                    </Link>
                    <Link to="/category/coding" style={{ textDecoration: "none" }}>
                        <div style={{
                            padding: "1.25rem",
                            border: "1px solid var(--border-color)",
                            borderRadius: "8px",
                            backgroundColor: "var(--bg-secondary)",
                            transition: "all 0.2s ease",
                            height: "100%",
                            cursor: "pointer"
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--accent-color)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border-color)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            <div style={{ marginBottom: "1rem", color: "var(--accent-color)" }}><Code2 size={32} /></div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>Coding & Programming Prompts</div>
                            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                                Free AI prompts for developers and programmers
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
