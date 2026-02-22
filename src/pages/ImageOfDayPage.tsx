import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, Image as ImageIcon } from 'lucide-react';
import ImageOfDayCard from '../components/ImageOfDayCard';
import { imageOfDayApi, type ImageOfDay } from '../lib/imageOfDayApi';

export default function ImageOfDayPage() {
    const [iods, setIods] = useState<ImageOfDay[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const data = await imageOfDayApi.getLatestImages(5);
            setIods(data);
            setLoading(false);
        }
        loadData();
    }, []);


    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "headline": "Latest AI Images and Prompts",
        "image": iods[0]?.image_url || "https://prompthub.shop/phub.png",
        "datePublished": iods[0]?.created_at || new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": "PromptHub"
        },
        "description": "Explore the latest AI generated images and their full prompts. Copy Midjourney, ChatGPT, and SDXL prompts for free."
    };

    return (
        <>
            <Helmet>
                <title>Latest AI Images and Prompts (Updated Daily) | PromptHub</title>
                <meta name="description" content="Explore the latest AI generated images and their full prompts. Copy Midjourney, ChatGPT, and SDXL prompts for free." />
                <meta name="keywords" content="AI image prompt, Midjourney prompt, AI image of the day, best AI prompts, prompt engineering" />
                <link rel="canonical" href="https://prompthub.shop/image-of-the-day" />

                {/* Open Graph Tags */}
                <meta property="og:title" content="Latest AI Images and Prompts (Updated Daily) | PromptHub" />
                <meta property="og:description" content="Explore the latest AI generated images and their full prompts. Copy Midjourney, ChatGPT, and SDXL prompts for free." />
                <meta property="og:image" content={iods[0]?.image_url || "https://prompthub.shop/phub.png"} />
                <meta property="og:url" content="https://prompthub.shop/image-of-the-day" />
                <meta property="og:type" content="website" />

                {/* Twitter Card Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Latest AI Images and Prompts (Updated Daily) | PromptHub" />
                <meta name="twitter:description" content="Explore the latest AI generated images and their full prompts. Copy Midjourney, ChatGPT, and SDXL prompts for free." />
                <meta name="twitter:image" content={iods[0]?.image_url || "https://prompthub.shop/phub.png"} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
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
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Latest AI Images</span>
            </nav>

            <div style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div style={{
                        padding: "0.75rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        color: "var(--text-primary)"
                    }}>
                        <ImageIcon size={28} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        Latest AI Images & Prompts
                    </h1>
                </div>
                <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "800px" }}>
                    Explore the latest daily featured AI images and copy the exact prompts used to create them.
                </p>
            </div>

            {loading ? (
                <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "1rem" }}>
                    Loading latest images...
                </div>
            ) : iods.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {iods.map((iod) => (
                        <ImageOfDayCard key={iod.id} item={iod} />
                    ))}
                </div>
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
