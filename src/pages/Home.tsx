import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, BookOpen, Search, Palette, PenTool, Code2 } from "lucide-react";

export default function Home() {
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
