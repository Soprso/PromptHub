import PromptForm from '../components/PromptForm';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, Share2, Users, Zap } from 'lucide-react';

export default function SharePromptPage() {
    return (
        <>
            <Helmet>
                <title>Share Your Prompt | PromptHub</title>
                <meta name="description" content="Share your best AI prompts with the community. Contribute to the largest open-source prompt library for ChatGPT, Midjourney, and Claude." />
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
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Share Prompt</span>
            </nav>

            <div style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div style={{
                        padding: "0.75rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        color: "var(--text-primary)"
                    }}>
                        <Share2 size={28} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        Share Your Prompt
                    </h1>
                </div>
                <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "800px" }}>
                    Contribute to the open-source prompt library. Your submission helps thousands of creators.
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
                    Why Share?
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
                        <span style={{ color: "var(--accent-color)", marginTop: "0.25rem" }}><Zap size={20} /></span>
                        <span style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Instant Impact</strong> — Your prompt goes live immediately for everyone to use
                        </span>
                    </li>
                    <li style={{ display: "flex", alignItems: "start", gap: "0.875rem" }}>
                        <span style={{ color: "var(--accent-color)", marginTop: "0.25rem" }}><Users size={20} /></span>
                        <span style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Help the Community</strong> — Join thousands contributing to the best prompt library
                        </span>
                    </li>
                    <li style={{ display: "flex", alignItems: "start", gap: "0.875rem" }}>
                        <span style={{ color: "var(--accent-color)", marginTop: "0.25rem" }}><Share2 size={20} /></span>
                        <span style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>No Account Required</strong> — Share anonymously without signup or paywalls
                        </span>
                    </li>
                </ul>
            </div>

            {/* Community Guidelines */}
            <div style={{
                marginBottom: "3rem",
                padding: "2rem",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                maxWidth: "800px"
            }}>
                <h2 style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "1rem",
                    color: "var(--text-primary)"
                }}>
                    Community Guidelines
                </h2>
                <p style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "1.5rem",
                    lineHeight: 1.6
                }}>
                    Help us maintain a high-quality prompt library by following these guidelines:
                </p>

                <div style={{
                    display: "grid",
                    gap: "1rem"
                }}>
                    <div>
                        <h3 style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            marginBottom: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <span style={{ color: "var(--accent-color)" }}>✓</span> Quality & Clarity
                        </h3>
                        <p style={{
                            fontSize: "0.8125rem",
                            color: "var(--text-secondary)",
                            margin: 0,
                            paddingLeft: "1.5rem",
                            lineHeight: 1.5
                        }}>
                            Submit prompts that are clear, well-tested, and genuinely useful. Include specific details and context.
                        </p>
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            marginBottom: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <span style={{ color: "var(--accent-color)" }}>✓</span> Submission Limits
                        </h3>
                        <p style={{
                            fontSize: "0.8125rem",
                            color: "var(--text-secondary)",
                            margin: 0,
                            paddingLeft: "1.5rem",
                            lineHeight: 1.5
                        }}>
                            Max 3000 characters per prompt • 30 second cooldown between posts • 10 submissions per day
                        </p>
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            marginBottom: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <span style={{ color: "#DC2626" }}>✗</span> Prohibited Content
                        </h3>
                        <p style={{
                            fontSize: "0.8125rem",
                            color: "var(--text-secondary)",
                            margin: 0,
                            paddingLeft: "1.5rem",
                            lineHeight: 1.5
                        }}>
                            No links, spam, advertising, inappropriate language, or harmful content. Keep it professional.
                        </p>
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            marginBottom: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <span style={{ color: "var(--accent-color)" }}>ℹ</span> Moderation
                        </h3>
                        <p style={{
                            fontSize: "0.8125rem",
                            color: "var(--text-secondary)",
                            margin: 0,
                            paddingLeft: "1.5rem",
                            lineHeight: 1.5
                        }}>
                            All submissions are reviewed before appearing publicly. Approved prompts help thousands of users.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: "800px" }}>
                <PromptForm onSuccess={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            </div>

            <div style={{
                marginTop: "2rem",
                padding: "1rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                maxWidth: "800px"
            }}>
                <Link
                    to="/community"
                    style={{
                        color: "var(--accent-color)",
                        textDecoration: "none",
                        fontWeight: 500
                    }}
                >
                    View Community Prompts →
                </Link>
            </div>
        </>
    );
}
