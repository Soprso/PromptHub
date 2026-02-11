import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Sparkles, ChevronRight, Users, Zap, Heart } from "lucide-react";

export default function About() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <Helmet>
                <title>About Us - PromptHub</title>
                <meta name="description" content="About PromptHub - The open library for high-quality AI prompts. Built for developers, creators, and prompt engineers." />
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
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>About</span>
            </nav>

            <div className="text-center mb-16">
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
                    <Sparkles size={32} style={{ color: "var(--accent-color)" }} />
                </div>
                <h1 style={{
                    fontSize: "3rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2
                }}>
                    About PromptHub
                </h1>
                <p style={{
                    fontSize: "1.25rem",
                    color: "var(--text-secondary)",
                    maxWidth: "600px",
                    margin: "0 auto",
                    lineHeight: 1.6
                }}>
                    The open source library for high-quality AI prompts.
                </p>
            </div>

            <div className="space-y-12">
                <section style={{
                    backgroundColor: "var(--bg-secondary)",
                    padding: "2.5rem",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)"
                }}>
                    <h2 style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        marginBottom: "1rem",
                        color: "var(--text-primary)"
                    }}>Our Mission</h2>
                    <p style={{
                        fontSize: "1.125rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                        margin: 0
                    }}>
                        PromptHub was built with a simple mission: to make high-quality AI prompts accessible to everyone.
                        We believe that communicating effectively with AI models is a skill that should be shared, not gatekept.
                        Our platform serves as a collaborative hub where creators, developers, and enthusiasts can discover, share,
                        and refine the prompts that power the next generation of AI applications.
                    </p>
                </section>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.5rem"
                }}>
                    <div style={{
                        padding: "2rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "12px",
                        border: "1px solid var(--border-color)"
                    }}>
                        <div style={{ marginBottom: "1rem", color: "var(--accent-color)" }}><Users size={28} /></div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>For Everyone</h3>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            No login required to browse. We believe in open access to knowledge. Use our prompts to learn, build, and create.
                        </p>
                    </div>
                    <div style={{
                        padding: "2rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "12px",
                        border: "1px solid var(--border-color)"
                    }}>
                        <div style={{ marginBottom: "1rem", color: "var(--accent-color)" }}><Zap size={28} /></div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>Quality First</h3>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            Our prompts are curated and tested. We focus on detailed, production-ready prompts that deliver real results.
                        </p>
                    </div>
                    <div style={{
                        padding: "2rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "12px",
                        border: "1px solid var(--border-color)"
                    }}>
                        <div style={{ marginBottom: "1rem", color: "var(--accent-color)" }}><Heart size={28} /></div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>Community Driven</h3>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            Built by the community, for the community. Share your best prompts and help others unlock the potential of AI.
                        </p>
                    </div>
                </div>

                <section style={{ textAlign: "center", padding: "2rem 0" }}>
                    <h2 style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        marginBottom: "1rem",
                        color: "var(--text-primary)"
                    }}>Join the Community</h2>
                    <p style={{
                        color: "var(--text-secondary)",
                        fontSize: "1.125rem",
                        marginBottom: "2rem",
                        maxWidth: "600px",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}>
                        Whether you're a seasoned prompt engineer or just getting started, there's a place for you here.
                    </p>
                    <Link
                        to="/community"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.75rem 1.5rem",
                            backgroundColor: "var(--accent-color)",
                            color: "#FFFFFF",
                            textDecoration: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
                            fontSize: "1rem",
                            transition: "opacity 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                        Explore Community Prompts <ChevronRight size={18} />
                    </Link>
                </section>
            </div>
        </div>
    );
}
