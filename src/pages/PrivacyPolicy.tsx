import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, Shield } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <Helmet>
                <title>Privacy Policy - PromptHub</title>
                <meta name="description" content="Privacy Policy for PromptHub. Learn how we handle your data, cookies, and protect your privacy." />
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
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Privacy Policy</span>
            </nav>

            <div style={{
                marginBottom: "3rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
            }}>
                <div style={{
                    padding: "0.75rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "8px",
                    color: "var(--accent-color)"
                }}>
                    <Shield size={32} />
                </div>
                <div>
                    <h1 style={{
                        fontSize: "2.5rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "0.5rem",
                        lineHeight: 1.2
                    }}>
                        Privacy Policy
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div style={{
                backgroundColor: "var(--bg-secondary)",
                padding: "2.5rem",
                borderRadius: "12px",
                border: "1px solid var(--border-color)"
            }}>
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-primary">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                            1. Introduction
                        </h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            Welcome to PromptHub. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website
                            and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-primary">2. Data We Collect</h2>
                        <p className="mb-4" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-disc pl-6 space-y-2" style={{ color: "var(--text-secondary)" }}>
                            <li><strong style={{ color: "var(--text-primary)" }}>Identity Data:</strong> includes username or similar identifier if you create an account.</li>
                            <li><strong style={{ color: "var(--text-primary)" }}>Contact Data:</strong> includes email address.</li>
                            <li><strong style={{ color: "var(--text-primary)" }}>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                            <li><strong style={{ color: "var(--text-primary)" }}>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-primary">3. How We Use Your Data</h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4" style={{ color: "var(--text-secondary)" }}>
                            <li>To provide the services you request (e.g., saving prompts).</li>
                            <li>To improve our website and user experience.</li>
                            <li>To manage your account and authentication via Clerk.</li>
                        </ul>
                        <p className="mt-4 font-semibold" style={{ color: "var(--text-primary)" }}>We do not sell your personal data to third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-primary">4. Cookies and Analytics</h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            We use cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
                        </p>
                        <p className="mt-4" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            We use third-party analytics services (such as Google Analytics) to help us understand how users engage with the Site. These services use cookies and similar technologies to collect information on your use of the Site and other websites.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-primary">5. Third-Party Services</h2>
                        <p className="mb-4" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
                        </p>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            We use <strong style={{ color: "var(--text-primary)" }}>Clerk</strong> for authentication. By using our authentication service, you agree to Clerk's privacy policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-primary">6. Advertising</h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            We use Google AdSense to serve ads. Google uses cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.
                        </p>
                        <p className="mt-2" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-color)" }} className="hover:underline">Google Ads Settings</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-primary">7. Contact Us</h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at:
                        </p>
                        <p className="mt-2 font-medium" style={{ color: "var(--text-primary)" }}>contact@promptshub.shop</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
