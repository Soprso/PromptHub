import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Mail, ChevronRight, MessageSquare } from "lucide-react";

export default function Contact() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <Helmet>
                <title>Contact Us - PromptHub</title>
                <meta name="description" content="Contact PromptHub. Get in touch with us for support, feedback, or inquiries." />
            </Helmet>

            {/* Breadcrumbs */}
            <nav style={{
                marginBottom: "2rem",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-muted)"
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
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Contact</span>
            </nav>

            <div className="text-center mb-12">
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "50%",
                    marginBottom: "1.5rem",
                    border: "1px solid var(--border-color)"
                }}>
                    <MessageSquare size={32} style={{ color: "var(--accent-color)" }} />
                </div>
                <h1 style={{
                    fontSize: "3rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2
                }}>
                    Get in Touch
                </h1>
                <p style={{
                    fontSize: "1.25rem",
                    color: "var(--text-secondary)",
                    maxWidth: "600px",
                    margin: "0 auto",
                    lineHeight: 1.6
                }}>
                    We'd love to hear from you.
                </p>
            </div>

            <div style={{
                backgroundColor: "var(--bg-secondary)",
                padding: "3rem",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                textAlign: "center",
                maxWidth: "600px",
                margin: "0 auto"
            }}>
                <p style={{
                    fontSize: "1.125rem",
                    color: "var(--text-secondary)",
                    marginBottom: "2.5rem",
                    lineHeight: 1.6
                }}>
                    Have a question, suggestion, or just want to say hello?
                    <br />
                    Drop us an email and we'll get back to you as soon as possible.
                </p>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.5rem"
                }}>
                    <a
                        href="mailto:contact@promptshub.shop"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "1rem 2rem",
                            backgroundColor: "var(--bg-primary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "12px",
                            textDecoration: "none",
                            transition: "all 0.2s ease"
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
                        <Mail size={24} style={{ color: "var(--accent-color)" }} />
                        <span style={{
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            color: "var(--text-primary)"
                        }}>
                            contact@promptshub.shop
                        </span>
                    </a>

                    <p style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                        marginTop: "1rem"
                    }}>
                        Typically responds within 24-48 hours
                    </p>
                </div>
            </div>
        </div>
    );
}
