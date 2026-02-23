import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, Image as ImageIcon } from 'lucide-react';
import ImageOfDayCard from '../components/ImageOfDayCard';
import { imageOfDayApi, type ImageOfDay } from '../lib/imageOfDayApi';

export default function ImageOfDayPage() {
    const [iods, setIods] = useState<ImageOfDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const { data, count } = await imageOfDayApi.getPaginatedImages(currentPage, ITEMS_PER_PAGE);
            setIods(data);
            setTotalCount(count);
            setLoading(false);

            // Scroll to top when page changes
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        loadData();
    }, [currentPage]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "headline": "Daily featured AI Gallery",
        "image": iods[0]?.image_url || "https://prompthub.shop/phub.png",
        "datePublished": iods[0]?.created_at || new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": "PromptHub"
        },
        "description": "Explore the latest AI generated images and their full prompts. Copy Midjourney, ChatGPT, and SDXL prompts for free."
    };

    const Pagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "3rem",
                marginBottom: "2rem",
                flexWrap: "wrap"
            }}>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "6px",
                        color: currentPage === 1 ? "var(--text-muted)" : "var(--text-primary)",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        transition: "all 0.2s"
                    }}
                >
                    Previous
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: currentPage === page ? "var(--accent-color)" : "var(--bg-secondary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "6px",
                            color: currentPage === page ? "#fff" : "var(--text-primary)",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            transition: "all 0.2s"
                        }}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "6px",
                        color: currentPage === totalPages ? "var(--text-muted)" : "var(--text-primary)",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        transition: "all 0.2s"
                    }}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <>
            <Helmet>
                <title>Daily featured AI Gallery (Updated Daily) | PromptHub</title>
                <meta name="description" content="Explore the latest AI generated images and their full prompts. Copy Midjourney, ChatGPT, and SDXL prompts for free." />
                <meta name="keywords" content="AI image prompt, Midjourney prompt, AI image of the day, best AI prompts, prompt engineering" />
                <link rel="canonical" href="https://prompthub.shop/image-of-the-day" />

                {/* Open Graph Tags */}
                <meta property="og:title" content="Daily featured AI Gallery (Updated Daily) | PromptHub" />
                <meta property="og:description" content="Explore the latest AI generated images and their full prompts. Copy Midjourney, ChatGPT, and SDXL prompts for free." />
                <meta property="og:image" content={iods[0]?.image_url || "https://prompthub.shop/phub.png"} />
                <meta property="og:url" content="https://prompthub.shop/image-of-the-day" />
                <meta property="og:type" content="website" />

                {/* Twitter Card Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Daily featured AI Gallery (Updated Daily) | PromptHub" />
                <meta name="twitter:description" content="Explore the latest AI generated images and their full prompts. Copy Midjourney, ChatGPT, and SDXL prompts for free." />
                <meta name="twitter:image" content={iods[0]?.image_url || "https://prompthub.shop/phub.png"} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
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
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Daily featured AI Gallery</span>
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
                        <ImageIcon size={24} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: 700, color: "var(--text-primary)" }}>
                        Daily featured AI Gallery
                    </h1>
                </div>
                <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: "clamp(1rem, 3vw, 1.125rem)", maxWidth: "800px" }}>
                    Explore the latest daily featured AI images and copy the exact prompts used to create them.
                </p>
            </div>

            {loading ? (
                <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "1rem" }}>
                    Loading latest images...
                </div>
            ) : iods.length > 0 ? (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {iods.map((iod) => (
                            <ImageOfDayCard key={iod.id} item={iod} />
                        ))}
                    </div>
                    <Pagination />
                </>
            ) : (
                <div style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)"
                }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🖼️</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                        No Image Found
                    </h3>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                        Check back later for an updated AI image of the day.
                    </p>
                    <Link
                        to="/community"
                        style={{
                            color: "var(--accent-color)",
                            textDecoration: "none",
                            fontWeight: 500
                        }}
                    >
                        Browse Community Prompts →
                    </Link>
                </div>
            )}
        </>
    );
}
