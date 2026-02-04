import { useState } from "react";
import Sidebar from "./Sidebar";
import "./DocumentationLayout.css";

interface DocumentationLayoutProps {
    children: React.ReactNode;
}

export default function DocumentationLayout({ children }: DocumentationLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="doc-layout">
            {/* Mobile Hamburger Button */}
            <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle navigation">
                <span className="hamburger-icon">☰</span>
            </button>

            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <main className="doc-content">
                <div className="doc-content-inner">
                    {children}
                </div>
            </main>
        </div>
    );
}
