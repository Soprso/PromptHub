import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { promptCategories } from "../data/prompts";
import { getCategoryIcon, getFolderIcon, UIIcons } from "../utils/iconMap";
import "./Sidebar.css";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const isCategoryActive = (categoryId: string) => {
        const path = location.pathname;
        const prefix = `/category/${categoryId}`;
        return path === prefix || path.startsWith(`${prefix}/`);
    };

    const isFolderActive = (categoryId: string, folderId: string) => {
        return location.pathname === `/category/${categoryId}/${folderId}`;
    };

    // Auto-expand active category on mount or navigation
    useEffect(() => {
        const activeCategoryId = promptCategories.find(cat => {
            const path = location.pathname;
            const prefix = `/category/${cat.id}`;
            return path === prefix || path.startsWith(`${prefix}/`);
        })?.id;

        if (activeCategoryId) {
            setExpandedCategories(prev => {
                const newSet = new Set(prev);
                newSet.add(activeCategoryId);
                return newSet;
            });
        }
    }, [location.pathname]);

    return (
        <>
            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
                <nav className="sidebar-nav">
                    <Link to="/" className="sidebar-home" onClick={onClose}>
                        <UIIcons.Home size={18} />
                        <span>PromptHub</span>
                    </Link>

                    <div className="sidebar-categories">
                        {promptCategories.map((category) => {
                            const isExpanded = expandedCategories.has(category.id);
                            const isActive = isCategoryActive(category.id);
                            const Icon = getCategoryIcon(category.id);

                            return (
                                <div key={category.id} className="sidebar-category">
                                    <button
                                        className={`sidebar-category-header ${isActive ? "active" : ""}`}
                                        onClick={() => toggleCategory(category.id)}
                                    >
                                        <span className="sidebar-category-toggle">
                                            {isExpanded ? <UIIcons.ChevronDown size={14} /> : <UIIcons.ChevronRight size={14} />}
                                        </span>
                                        <Icon size={16} className="sidebar-category-icon-main" />
                                        <span className="sidebar-category-name">{category.name}</span>
                                    </button>

                                    {isExpanded && (
                                        <div className="sidebar-folders">
                                            {category.folders.map((folder) => {
                                                const FolderIcon = getFolderIcon(folder.id);
                                                return (
                                                    <Link
                                                        key={folder.id}
                                                        to={`/category/${category.id}/${folder.id}`}
                                                        className={`sidebar-folder ${isFolderActive(category.id, folder.id) ? "active" : ""}`}
                                                        onClick={onClose}
                                                    >
                                                        <FolderIcon size={15} />
                                                        <span className="sidebar-folder-name">{folder.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </nav>
            </aside>

            {/* Mobile backdrop */}
            {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
        </>
    );
}
