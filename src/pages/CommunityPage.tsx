import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import CommunityPromptCard from '../components/CommunityPromptCard';
import CommunityFilters from '../components/CommunityFilters';
import { communityApi, type SharedPrompt } from '../lib/communityApi';
import { ChevronRight, Users, Sparkles, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PROMPTS_PER_PAGE = 20;

export default function CommunityPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [prompts, setPrompts] = useState<SharedPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [sortOrder, setSortOrder] = useState<'newest' | 'most-liked'>('newest');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        async function loadPrompts() {
            setLoading(true);
            const response = await communityApi.getPrompts(currentPage, PROMPTS_PER_PAGE, searchQuery);
            setPrompts(response.prompts);
            setTotal(response.total);
            setLoading(false);
        }
        loadPrompts();
    }, [currentPage, searchQuery]);

    // Extract unique tags from current prompts
    const availableTags = useMemo(() => {
        const tagSet = new Set<string>();
        prompts.forEach(prompt => {
            if (prompt.tags && Array.isArray(prompt.tags)) {
                prompt.tags.forEach(tag => tagSet.add(tag));
            }
        });
        return Array.from(tagSet).sort();
    }, [prompts]);

    // Apply client-side filtering and sorting
    const filteredAndSortedPrompts = useMemo(() => {
        let result = [...prompts];

        // Filter by selected tags (OR logic - show prompts that have ANY of the selected tags)
        if (selectedTags.length > 0) {
            result = result.filter(prompt =>
                prompt.tags &&
                Array.isArray(prompt.tags) &&
                prompt.tags.some(tag => selectedTags.includes(tag))
            );
        }

        // Sort
        if (sortOrder === 'most-liked') {
            result.sort((a, b) => b.like_count - a.like_count);
        } else {
            // newest - already sorted by created_at from API, but ensure consistency
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        return result;
    }, [prompts, selectedTags, sortOrder]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const totalPages = Math.ceil(total / PROMPTS_PER_PAGE);

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearSearch = () => {
        setSearchParams({});
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showPages = 5; // Show 5 page numbers at most

        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <>
            <Helmet>
                <title>Community Prompts | PromptHub</title>
                <meta name="description" content="Discover the latest AI prompts shared by the PromptHub community. Free, open-source prompts for ChatGPT, Claude, and Midjourney." />
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
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Community</span>
            </nav>

            <div style={{ marginBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div style={{
                        padding: "0.75rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        color: "var(--text-primary)"
                    }}>
                        <Users size={28} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        Community Prompts
                    </h1>
                </div>
                <p style={{ margin: "0", color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "800px" }}>
                    Browse prompts shared by the community. All submissions are free and open-source.
                </p>
            </div>

            {/* Search indicator */}
            {searchQuery && (
                <div style={{
                    marginBottom: "2rem",
                    padding: "1rem 1.25rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem"
                }}>
                    <div>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                            Showing {total} result{total !== 1 ? 's' : ''} for <strong style={{ color: "var(--text-primary)" }}>"{searchQuery}"</strong>
                        </span>
                    </div>
                    <button
                        onClick={clearSearch}
                        style={{
                            padding: "0.375rem 0.75rem",
                            backgroundColor: "transparent",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            fontFamily: "inherit"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--text-secondary)";
                            e.currentTarget.style.color = "var(--text-primary)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--border-color)";
                            e.currentTarget.style.color = "var(--text-muted)";
                        }}
                    >
                        Clear search
                    </button>
                </div>
            )}

            <div style={{
                backgroundColor: "var(--bg-secondary)",
                padding: "2rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                marginBottom: "3rem"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h2 style={{
                            fontSize: "1.125rem",
                            fontWeight: 600,
                            marginBottom: "0.5rem",
                            color: "var(--text-primary)"
                        }}>
                            Share Your Best Prompts
                        </h2>
                        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                            Help the community by contributing your most effective prompts
                        </p>
                    </div>
                    <Link
                        to="/share"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.625rem 1.25rem",
                            backgroundColor: "var(--accent-color)",
                            color: "#FFFFFF",
                            textDecoration: "none",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            transition: "opacity 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                        <Sparkles size={16} />
                        Share Prompt
                    </Link>
                </div>
            </div>

            {/* Filters and Sorting */}
            {!loading && prompts.length > 0 && (
                <CommunityFilters
                    sortOrder={sortOrder}
                    onSortChange={setSortOrder}
                    availableTags={availableTags}
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                />
            )}

            {loading ? (
                <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    Loading prompts...
                </div>
            ) : prompts.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)"
                }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                        {searchQuery ? 'No prompts found' : 'No prompts yet'}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                        {searchQuery ? 'Try a different search query' : 'Be the first to share a prompt with the community'}
                    </p>
                    {searchQuery ? (
                        <button
                            onClick={clearSearch}
                            style={{
                                color: "var(--accent-color)",
                                textDecoration: "none",
                                fontWeight: 500,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "inherit",
                                fontFamily: "inherit"
                            }}
                        >
                            Clear search →
                        </button>
                    ) : (
                        <Link
                            to="/share"
                            style={{
                                color: "var(--accent-color)",
                                textDecoration: "none",
                                fontWeight: 500
                            }}
                        >
                            Share a Prompt →
                        </Link>
                    )}
                </div>
            ) : filteredAndSortedPrompts.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)"
                }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                        No prompts found
                    </h3>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                        Try another filter or clear your selections
                    </p>
                    <button
                        onClick={() => setSelectedTags([])}
                        style={{
                            color: "var(--accent-color)",
                            textDecoration: "none",
                            fontWeight: 500,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "inherit",
                            fontFamily: "inherit"
                        }}
                    >
                        Clear filters →
                    </button>
                </div>
            ) : (
                <>
                    <div className="prompt-list">
                        {filteredAndSortedPrompts.map(prompt => (
                            <CommunityPromptCard key={prompt.id} prompt={prompt} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{
                            marginTop: "3rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            flexWrap: "wrap"
                        }}>
                            {/* First Page */}
                            <button
                                onClick={() => goToPage(1)}
                                disabled={currentPage === 1}
                                style={{
                                    padding: "0.5rem",
                                    backgroundColor: "transparent",
                                    color: currentPage === 1 ? "var(--text-muted)" : "var(--text-secondary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "6px",
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "all 0.2s",
                                    fontFamily: "inherit"
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== 1) {
                                        e.currentTarget.style.borderColor = "var(--text-secondary)";
                                        e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                                aria-label="First page"
                            >
                                <ChevronsLeft size={16} />
                            </button>

                            {/* Previous Page */}
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{
                                    padding: "0.5rem 0.75rem",
                                    backgroundColor: "transparent",
                                    color: currentPage === 1 ? "var(--text-muted)" : "var(--text-secondary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "6px",
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s",
                                    fontFamily: "inherit"
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== 1) {
                                        e.currentTarget.style.borderColor = "var(--text-secondary)";
                                        e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                <ChevronLeft size={16} />
                                <span>Previous</span>
                            </button>

                            {/* Page Numbers */}
                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} style={{ padding: "0.5rem", color: "var(--text-muted)" }}>...</span>
                                ) : (
                                    <button
                                        key={`page-${page}`}
                                        onClick={() => goToPage(page as number)}
                                        style={{
                                            padding: "0.5rem 0.75rem",
                                            backgroundColor: currentPage === page ? "var(--accent-color)" : "transparent",
                                            color: currentPage === page ? "#FFFFFF" : "var(--text-secondary)",
                                            border: `1px solid ${currentPage === page ? "var(--accent-color)" : "var(--border-color)"}`,
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            fontWeight: 500,
                                            minWidth: "2.5rem",
                                            transition: "all 0.2s",
                                            fontFamily: "inherit"
                                        }}
                                        onMouseEnter={(e) => {
                                            if (currentPage !== page) {
                                                e.currentTarget.style.borderColor = "var(--text-secondary)";
                                                e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (currentPage !== page) {
                                                e.currentTarget.style.borderColor = "var(--border-color)";
                                                e.currentTarget.style.backgroundColor = "transparent";
                                            }
                                        }}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}

                            {/* Next Page */}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: "0.5rem 0.75rem",
                                    backgroundColor: "transparent",
                                    color: currentPage === totalPages ? "var(--text-muted)" : "var(--text-secondary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "6px",
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s",
                                    fontFamily: "inherit"
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== totalPages) {
                                        e.currentTarget.style.borderColor = "var(--text-secondary)";
                                        e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                <span>Next</span>
                                <ChevronRight size={16} />
                            </button>

                            {/* Last Page */}
                            <button
                                onClick={() => goToPage(totalPages)}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: "0.5rem",
                                    backgroundColor: "transparent",
                                    color: currentPage === totalPages ? "var(--text-muted)" : "var(--text-secondary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "6px",
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "all 0.2s",
                                    fontFamily: "inherit"
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== totalPages) {
                                        e.currentTarget.style.borderColor = "var(--text-secondary)";
                                        e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                                aria-label="Last page"
                            >
                                <ChevronsRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
