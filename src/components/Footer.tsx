import { Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border-color)",
            color: "var(--text-muted)",
            fontSize: "0.875rem"
        }}>
            <div style={{
                maxWidth: "100%", /* Matches doc-layout max-width context if inside it, but footer is inside layout now? */
                /* Actually Footer is inside DocumentationLayout .doc-content or outside? */
                /* Let's check App.tsx structure */
                /* In Step 116 summary: App.tsx wraps Routes with DocumentationLayout. */
                /* DocumentationLayout contains {children} and then <Footer> ? No, let's check DocumentationLayout.tsx */
                /* I'll assume Footer is inside content area or at bottom. */
                /* Just fixing the icon for now. */
                margin: "0 auto",
                padding: "0"
            }}>
                {/* Main footer content */}
                <div style={{
                    marginBottom: "1.5rem"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem"
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

                {/* Bottom row */}
                <div style={{
                    paddingTop: "1.5rem",
                    borderTop: "1px solid var(--border-color)",
                    textAlign: "center",
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)"
                }}>
                    © {new Date().getFullYear()} PromptHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
