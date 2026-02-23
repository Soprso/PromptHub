import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer style={{
            marginTop: "auto",
            paddingTop: "3rem",
            paddingBottom: "2rem",
            borderTop: "1px solid var(--border-color)",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            backgroundColor: "var(--bg-primary)"
        }}>
            <div className="footer-container" style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 1.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "3rem",
            }}>
                {/* Brand & Tagline */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "0.75rem"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}>
                        <span style={{ color: "var(--accent-color)" }}><Sparkles size={20} /></span>
                        <span style={{
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            color: "var(--text-primary)"
                        }}>
                            PromptHub
                        </span>
                    </div>
                    <p style={{
                        margin: 0,
                        maxWidth: "300px",
                        lineHeight: "1.6",
                        textAlign: "left"
                    }}>
                        The open-source AI prompt library for developers, writers, and creators. Discover battle-tested prompts for every AI tool.
                    </p>
                </div>

                {/* Prompt Library */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h4 style={{ color: "var(--text-primary)", fontWeight: 600, margin: 0 }}>Prompt Library</h4>
                    <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <Link to="/community" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">All Prompts</Link>
                        <Link to="/prompts" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">ChatGPT Prompts</Link>
                        <Link to="/midjourney-logo-prompts" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">Midjourney Prompts</Link>
                        <Link to="/category/ai-image-generation" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">Stable Diffusion Prompts</Link>
                        <Link to="/image-of-the-day" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">AI Art Gallery</Link>
                    </nav>
                </div>

                {/* Categories */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h4 style={{ color: "var(--text-primary)", fontWeight: 600, margin: 0 }}>Categories</h4>
                    <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <Link to="/category/writing" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">Writing Prompts</Link>
                        <Link to="/category/coding" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">Coding Prompts</Link>
                        <Link to="/category/marketing" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">Marketing Prompts</Link>
                        <Link to="/category/productivity" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">Productivity Prompts</Link>
                        <Link to="/sitemap" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">HTML Sitemap</Link>
                    </nav>
                </div>

                {/* Legal & About */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h4 style={{ color: "var(--text-primary)", fontWeight: 600, margin: 0 }}>Company</h4>
                    <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <Link to="/about" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">About Us</Link>
                        <Link to="/contact" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">Contact</Link>
                        <Link to="/privacy-policy" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">Privacy Policy</Link>
                    </nav>
                    <div style={{
                        marginTop: "auto",
                        fontSize: "0.8125rem",
                        color: "var(--text-muted)",
                        opacity: 0.8,
                        paddingTop: "1rem"
                    }}>
                        © {new Date().getFullYear()} PromptHub.
                    </div>
                </div>
            </div>
        </footer>
    );
}
