import {
    Image, UserRound, Camera, Palette, MountainSnow, Building2,
    Lightbulb, Users, Wand2, Ghost, ScanFace, Building, Armchair,
    Layers, Hexagon, Layout, Gamepad2, FileText, MinusCircle,
    Sliders, PenTool, Code2, BookOpen, Briefcase, Heart, Coffee,
    Globe, FlaskConical, LayoutGrid, Terminal, Cpu, Database,
    Smartphone, Search, ChevronRight, ChevronDown, Copy, Check,
    Menu, X, Home, TrendingUp, ShoppingCart
} from "lucide-react";
import React from "react";

// Map for category IDs
export const categoryIcons: Record<string, React.ElementType> = {
    "ai-image-generation": Image,
    "writing": PenTool,
    "coding": Code2,
    "creative-design-prompts": Layout,
    "education-course-prompts": BookOpen,
    "career": Briefcase,
    "health": Heart,
    "daily": Coffee,
    "travel": Globe,
    "science": FlaskConical,
    "games": Gamepad2,
    "philosophy": Lightbulb,
    "practical": Sliders,
    "business-strategy-prompts": Briefcase,
    "email-communication-prompts": FileText,
    "marketing-growth-prompts": TrendingUp,
    "market-research-analysis": Search,
    "ecommerce-product-prompts": ShoppingCart,
    "software-engineering-prompts": Code2
};

// Map for folder IDs - fallback to generic icons if not found
export const folderIcons: Record<string, React.ElementType> = {
    // Image Generation
    "portrait-photography-prompts": UserRound,
    "photography-styles": Camera,
    "ai-art-styles": Palette,
    "landscapes": MountainSnow,
    "urban-cityscapes": Building2,
    "camera-settings": Camera,
    "studio-lighting": Lightbulb,
    "realistic-humans": Users,
    "fantasy-scifi": Wand2,
    "anime-characters": Ghost, // or Smile
    "anime-generator": ScanFace,
    "fantasy-creatures": Ghost,
    "architecture": Building,
    "interior-design": Armchair,
    "textures-patterns": Layers,
    "logos-branding": Hexagon,
    "web-app-design": Layout,
    "game-assets": Gamepad2,
    "prompt-helpers": FileText,
    "prompt-enhancers": Wand2,
    "negative-prompts": MinusCircle,
    "midjourney-params": Sliders,

    // Writing
    "blog-writing": PenTool,
    "copywriting": FileText,
    "creative-writing": BookOpen,

    // Coding
    "web-development": Globe,
    "python-scripting": Terminal,
    "database-sql": Database,
    "mobile-dev": Smartphone,
    "algorithms": Cpu,

    // New/Renamed Folders
    "character-design-prompts": Ghost,
    "anime-realistic-conversion": ScanFace,
    "fashion-clothing-prompts": Sliders,
    "product-photography-prompts": Sliders,
    "food-photography-prompts": Coffee,
    "pricing-strategy-models": Briefcase,
    "cold-email-responses": FileText,
    "customer-support-scripts": Users,
    "social-media-chat": Users,
    "internal-communication-docs": FileText,
    "content-marketing-strategy": PenTool,
    "advertising-copy-ads": Lightbulb,
    "growth-marketing-analytics": TrendingUp,
    "market-trend-analysis": Globe,
    "user-experience-research": Users,
    "data-analysis-reporting": Database,
    "product-descriptions-copy": FileText,
    "customer-personalization": Users,
    "conversion-rate-optimization": TrendingUp,
    "code-review-standards": Check,
    "devops-deployment-ci-cd": Terminal,
    "qa-testing-automation": Code2,
    "blockchain-smart-contracts": Code2,
    "concept-art-illustration": Palette,
    "ui-ux-prototyping": Layout,
    "course-curriculum-design": BookOpen,
    "community-engagement-strategy": Users
};

// Helper to get icon
export const getCategoryIcon = (id: string) => {
    return categoryIcons[id] || LayoutGrid;
};

export const getFolderIcon = (id: string) => {
    return folderIcons[id] || FileText;
};

// Common UI icons
export const UIIcons = {
    Search,
    ChevronRight,
    ChevronDown,
    Copy,
    Check,
    Menu,
    Close: X,
    Home
};
