import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { searchPrompts, type SearchResult } from "../utils/search";
import phubIcon from "../assets/phub.png";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Handle search - make it async to support community prompts
    useEffect(() => {
        async function performSearch() {
            if (searchQuery.trim()) {
                const results = await searchPrompts(searchQuery);
                setSearchResults(results);
                setShowResults(true);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }
        performSearch();
    }, [searchQuery]);

    // Close search results when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleResultClick = (result: SearchResult) => {
        if (result.type === 'community') {
            // Navigate to community page with search query
            navigate(`/community?search=${encodeURIComponent(searchQuery)}`);
        } else if ((result.type === 'guide' || result.type === 'guide-prompt') && result.slug) {
            navigate(`/${result.slug}`);
        } else if (result.category && result.folder) {
            navigate(`/category/${result.category.id}/${result.folder.id}`);
        }
        setSearchQuery("");
        setShowResults(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo" onClick={() => setSearchQuery("")}>
                    <img src={phubIcon} alt="PromptHub Logo" className="logo-icon" style={{ height: "2.2rem", width: "auto", display: "block" }} />
                    <span className="logo-text">PromptHub</span>
                </Link>

                {/* Search */}
                <div className="navbar-search" ref={searchRef}>
                    <div className="search-input-wrapper">
                        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search free AI prompts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setShowResults(true)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="search-clear"
                                aria-label="Clear search"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && (
                        <div className="search-results">
                            {searchResults.length > 0 ? (
                                <>
                                    <div className="search-results-header">
                                        {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                                    </div>
                                    <div className="search-results-list">
                                        {searchResults.map((result, index) => (
                                            <button
                                                key={`${result.prompt.id}-${index}`}
                                                onClick={() => handleResultClick(result)}
                                                className="search-result-item"
                                            >
                                                <div className="search-result-title">{result.prompt.title}</div>
                                                <div className="search-result-path">{result.path}</div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="search-no-results">No prompts found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Community Link */}
                <Link to="/community" className="builder-link" style={{ marginRight: '10px' }}>
                    <button className="builder-button" aria-label="Community Feed">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span className="builder-text">Community</span>
                    </button>
                </Link>

                {/* Share Link */}
                <Link to="/share" className="builder-link" style={{ marginRight: '10px' }}>
                    <button className="builder-button" aria-label="Share Prompt">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        <span className="builder-text">Share Prompt</span>
                    </button>
                </Link>

                {/* Prompt Builder Button */}
                <Link to="/builder" className="builder-link">
                    <button className="builder-button" aria-label="Prompt Builder">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                        <span className="builder-text">Builder</span>
                    </button>
                </Link>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="theme-toggle"
                    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                    {theme === "light" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    )}
                </button>
            </div>
        </nav>
    );
}
