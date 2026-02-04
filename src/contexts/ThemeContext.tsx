import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage first
        const stored = localStorage.getItem("prompthub-theme");
        if (stored === "light" || stored === "dark") {
            return stored;
        }

        // Check system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }

        return "light";
    });

    useEffect(() => {
        // Update localStorage
        localStorage.setItem("prompthub-theme", theme);

        // Update document class
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                "content",
                theme === "dark" ? "#111827" : "#ffffff"
            );
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
