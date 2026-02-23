import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { promptCategories } from "../data/prompts";
import { seoPages } from "../data/seo-pages";
import { Layout, Book, Folder, FileText, Globe } from "lucide-react";

export default function SitemapPage() {
    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>
            <Helmet>
                <title>Sitemap | PromptHub</title>
                <meta name="description" content="Explore all AI prompt categories, guides, and resources on PromptHub." />
            </Helmet>

            <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <Layout size={32} style={{ color: "var(--accent-color)" }} />
                    <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)" }}>Sitemap</h1>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
                    Explore our comprehensive library of AI prompts and resources.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
                {/* Main Pages */}
                <section>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Globe size={20} style={{ color: "var(--accent-color)" }} /> Main Pages
                    </h2>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <li><Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">Homepage</Link></li>
                        <li><Link to="/community" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">Prompt Library (Community)</Link></li>
                        <li><Link to="/builder" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">AI Prompt Builder</Link></li>
                        <li><Link to="/image-of-the-day" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">AI Art Gallery</Link></li>
                        <li><Link to="/share" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">Share a Prompt</Link></li>
                    </ul>
                </section>

                {/* AI Prompt Categories */}
                <section>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Folder size={20} style={{ color: "var(--accent-color)" }} /> Prompt Categories
                    </h2>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {promptCategories.map(cat => (
                            <li key={cat.id}>
                                <Link to={`/category/${cat.id}`} style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* AI Guides & SEO Pages */}
                <section>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Book size={20} style={{ color: "var(--accent-color)" }} /> AI Guides & Tutorials
                    </h2>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {seoPages.map(page => (
                            <li key={page.slug}>
                                <Link to={`/${page.slug}`} style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">
                                    {page.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Company & Legal */}
                <section>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FileText size={20} style={{ color: "var(--accent-color)" }} /> Company Info
                    </h2>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <li><Link to="/about" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">About Us</Link></li>
                        <li><Link to="/contact" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">Contact</Link></li>
                        <li><Link to="/privacy-policy" style={{ color: "var(--text-muted)", textDecoration: "none" }} className="hover:underline">Privacy Policy</Link></li>
                    </ul>
                </section>
            </div>

            <style>{`
                .hover\\:underline:hover {
                    text-decoration: underline !important;
                    color: var(--accent-color) !important;
                }
            `}</style>
        </div>
    );
}
