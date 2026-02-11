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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "1.5rem"
            }}>
                {/* Brand & Tagline */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
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
                            fontSize: "1rem",
                            color: "var(--text-primary)"
                        }}>
                            PromptHub
                        </span>
                    </div>
                    <p style={{
                        margin: 0,
                        maxWidth: "300px",
                        lineHeight: "1.5"
                    }}>
                        The open prompt library for builders.
                    </p>
                </div>

                {/* Links */}
                <div style={{
                    display: "flex",
                    gap: "1.5rem",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <Link to="/privacy-policy" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link to="/about" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">
                        About
                    </Link>
                    <Link to="/contact" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary transition-colors">
                        Contact
                    </Link>
                </div>

                {/* Copyright */}
                <div style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                    opacity: 0.8
                }}>
                    © {new Date().getFullYear()} PromptHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
