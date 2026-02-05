import { Link } from "react-router-dom";
import { Copy, BookOpen, Search, Palette, PenTool, Code2 } from "lucide-react";

export default function Home() {
    return (
        <div>
            <div style={{ marginBottom: "2.5rem", maxWidth: "800px" }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em"
                }}>
                    Discover Free AI Prompts for Every Task
                </h1>
                <p style={{
                    color: "var(--text-secondary)",
                    fontSize: "1.125rem",
                    lineHeight: "1.75",
                    marginBottom: "2rem"
                }}>
                    Browse our comprehensive collection of free AI prompts for ChatGPT, Midjourney, DALL·E, and more. Perfect for image generation, content writing, coding, and creative projects—no signup required.
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
                    How to Use Free AI Prompts
                </h2>
                <ul style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                }}>
                    <li style={{ display: "flex", alignItems: "start", gap: "0.875rem" }}>
                        <span style={{ color: "var(--accent-color)", marginTop: "0.25rem" }}><BookOpen size={20} /></span>
                        <span style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Browse categories</strong> in the sidebar to explore different prompt types
                        </span>
                    </li>
                    <li style={{ display: "flex", alignItems: "start", gap: "0.875rem" }}>
                        <span style={{ color: "var(--accent-color)", marginTop: "0.25rem" }}><Search size={20} /></span>
                        <span style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Use the search bar</strong> to quickly find specific prompts
                        </span>
                    </li>
                    <li style={{ display: "flex", alignItems: "start", gap: "0.875rem" }}>
                        <span style={{ color: "var(--accent-color)", marginTop: "0.25rem" }}><Copy size={20} /></span>
                        <span style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Copy prompts</strong> with one click to use in your AI tools
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
                    <Link to="/category/image" style={{ textDecoration: "none" }}>
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
