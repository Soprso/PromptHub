import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { imageOfDayApi, type ImageOfDay } from '../lib/imageOfDayApi';
import ImageModal from '../components/ImageModal';

export default function ImageArchivePage() {
    const [iods, setIods] = useState<ImageOfDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedImage, setSelectedImage] = useState<{ url: string, alt: string } | null>(null);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const { data, count } = await imageOfDayApi.getPaginatedImages(currentPage, ITEMS_PER_PAGE);
                setIods(data);
                setTotalCount(count);
            } catch (error) {
                console.error('Failed to load archive images:', error);
            }
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        loadData();
    }, [currentPage]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const Pagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);

        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "4rem",
                marginBottom: "2rem",
                flexWrap: "wrap"
            }}>
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
            </div>
        );
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
            <Helmet>
                <title>AI Image Archive | PromptHub</title>
                <meta name="description" content="Browse our historical gallery of daily featured AI generated images and prompts." />
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
                <Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
                <ChevronRight size={14} />
                <Link to="/image-of-the-day" style={{ color: "var(--text-muted)", textDecoration: "none" }}>AI Gallery</Link>
                <ChevronRight size={14} />
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Archive</span>
            </nav>

            <header style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{
                        padding: "0.6rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        color: "var(--text-primary)"
                    }}>
                        <LayoutGrid size={24} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        AI Image Archive
                    </h1>
                </div>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "600px" }}>
                    A visual history of our favorite AI generated masterpieces. Click any image to view it in high resolution.
                </p>
            </header>

            {loading ? (
                <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-secondary)" }}>
                    Loading archive gallery...
                </div>
            ) : iods.length > 0 ? (
                <>
                    <div className="image-archive-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1.5rem"
                    }}>
                        {iods.map((iod) => (
                            <div
                                key={iod.id}
                                onClick={() => setSelectedImage({ url: iod.image_url, alt: "AI Generated Image" })}
                                style={{
                                    position: "relative",
                                    aspectRatio: "1/1",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    cursor: "zoom-in",
                                    backgroundColor: "var(--bg-secondary)",
                                    border: "1px solid var(--border-color)",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                }}
                                className="archive-card"
                            >
                                <img
                                    src={iod.image_url}
                                    alt="AI Generated Artwork"
                                    loading="lazy"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.5s ease"
                                    }}
                                />
                                <div className="overlay" style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "rgba(0,0,0,0.2)",
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <ImageIcon color="#fff" size={32} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination />
                </>
            ) : (
                <div style={{ textAlign: "center", padding: "5rem", opacity: 0.7 }}>
                    No images found in the archive.
                </div>
            )}

            {selectedImage && (
                <ImageModal
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    imageUrl={selectedImage.url}
                    altText={selectedImage.alt}
                />
            )}

            <style>{`
                .archive-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent-color);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }
                .archive-card:hover img {
                    transform: scale(1.05);
                }
                .archive-card:hover .overlay {
                    opacity: 1;
                }
                @media (max-width: 640px) {
                    .image-archive-grid {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
                        gap: 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
