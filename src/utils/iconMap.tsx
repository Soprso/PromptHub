import {
    Image, UserRound, Camera, Palette, MountainSnow, Building2,
    Lightbulb, Users, Wand2, Ghost, ScanFace, Building, Armchair,
    Layers, Hexagon, Layout, Gamepad2, FileText, MinusCircle,
    Sliders, PenTool, Code2, BookOpen, Briefcase, Heart, Coffee,
    Globe, FlaskConical, LayoutGrid, Terminal, Cpu, Database,
    Smartphone, Search, ChevronRight, ChevronDown, Copy, Check,
    Menu, X, Home
} from "lucide-react";
import React from "react";

// Map for category IDs
export const categoryIcons: Record<string, React.ElementType> = {
    "image": Image,
    "writing": PenTool,
    "coding": Code2,
    "design": Layout,
    "education": BookOpen,
    "career": Briefcase,
    "health": Heart,
    "daily": Coffee,
    "travel": Globe,
    "science": FlaskConical,
    "games": Gamepad2,
    "philosophy": Lightbulb,
    "practical": Sliders
};

// Map for folder IDs - fallback to generic icons if not found
export const folderIcons: Record<string, React.ElementType> = {
    // Image Generation
    "portraits": UserRound,
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
    "algorithms": Cpu
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
