import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { promptCategories } from "../data/prompts";
import { getCategoryIcon, getFolderIcon } from "../utils/iconMap";
import { ChevronRight } from "lucide-react";

export default function CategoryPage() {
    const { categoryId } = useParams<{ categoryId: string }>();

    const category = promptCategories.find((cat) => cat.id === categoryId);

    if (!category) {
        return <Navigate to="/" replace />;
    }

    const CategoryIcon = getCategoryIcon(category.id);

    // Construct SEO-friendly title and description
    const pageTitle = `${category.name} – Free AI Prompts | PromptHub`;
    const pageDescription = category.description || `Browse ${category.folders.length}+ ${category.name.toLowerCase()} for ChatGPT, Claude, and other AI tools. Free, no signup required.`;
    const pageUrl = `https://promptshub.shop/category/${categoryId}`;

    return (
        <div>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={pageUrl} />
                <link rel="canonical" href={pageUrl} />
            </Helmet>
            {/* Breadcrumbs */}
            <nav style={{
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
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
                <span style={{ color: "var(--text-secondary)" }}>{category.name}</span>
            </nav>

            <div style={{ marginBottom: "2rem" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                    flexWrap: "wrap"
                }}>
                    <div style={{
                        padding: "0.6rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <CategoryIcon size={24} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: 700, color: "var(--text-primary)" }}>
                        {category.name}
                    </h1>
                </div>
                {category.description && (
                    <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: "clamp(1rem, 3vw, 1.125rem)", maxWidth: "800px" }}>
                        {category.description}
                    </p>
                )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {category.folders.map((folder) => {
                    const FolderIcon = getFolderIcon(folder.id);
                    return (
                        <Link
                            key={folder.id}
                            to={`/category/${categoryId}/${folder.id}`}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                padding: "1rem 1.25rem",
                                border: "1px solid var(--border-color)",
                                borderRadius: "6px",
                                transition: "all 0.15s ease",
                                backgroundColor: "var(--bg-primary)",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--accent-color)";
                                e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border-color)";
                                e.currentTarget.style.backgroundColor = "var(--bg-primary)";
                            }}
                        >
                            <span style={{ color: "var(--text-muted)" }}><FolderIcon size={20} /></span>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                                    {folder.name}
                                </h3>
                            </div>
                            <span style={{
                                fontSize: "0.75rem",
                                color: "var(--text-muted)",
                                padding: "0.25rem 0.625rem",
                                backgroundColor: "var(--bg-secondary)",
                                borderRadius: "99px",
                                marginRight: "0.5rem"
                            }}>
                                {folder.prompts.length} prompt{folder.prompts.length !== 1 ? "s" : ""}
                            </span>
                            <span style={{ color: "var(--text-muted)" }}><ChevronRight size={16} /></span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
