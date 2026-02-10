export interface Template {
    id: string;
    name: string;
    prompt: string;
}

export const templates: Template[] = [
    {
        id: "image",
        name: "Image Generation",
        prompt: "Create a {style} {shot_type} of {subject} in {lighting} with {mood} mood, {camera} camera, high detail"
    },
    {
        id: "video",
        name: "Video Generation",
        prompt: "Generate a {duration} {style} video of {subject} with {camera_movement} camera movement, {lighting} lighting, {mood} atmosphere, {fps} fps"
    },
    {
        id: "writing",
        name: "Writing",
        prompt: "Write a {tone} {format} about {topic} for {audience} audience, {length} length, {style} style"
    },
    {
        id: "coding",
        name: "Coding",
        prompt: "Write {language} code to {task} using {framework}, with {style} code style, include {features}"
    }
];

// Preset options for each variable
export const presets: Record<string, string[]> = {
    // Image Generation
    style: [
        "cinematic", "photorealistic", "anime", "3D render", "studio photography",
        "minimalist", "watercolor illustration", "oil painting", "cyberpunk", "fantasy art",
        "vintage film", "pixel art", "isometric", "flat design", "hyperreal",
        "synthwave", "vaporwave", "steampunk", "noir", "psychedelic",
        "ukiyo-e", "bauhaus", "art deco", "cubism", "surrealism",
        "pencil sketch", "charcoal drawing", "linocut", "comic book", "pop art",
        "low poly", "voxel art", "claymation", "papercraft", "origami",
        "matte painting", "concept art", "digital art", "vector art", "graffiti"
    ],
    shot_type: [
        "close-up", "portrait", "full body", "wide shot", "macro",
        "aerial view", "top-down", "over-the-shoulder", "product shot", "street photography",
        "candid", "hero shot", "medium shot", "cowboy shot", "dutch angle",
        "eye-level", "low angle", "high angle", "worm's-eye view", "bird's-eye view",
        "panorama", "fisheye", "tilt-shift", "split screen", "POV"
    ],
    lighting: [
        "soft light", "golden hour", "studio lighting", "neon glow", "dramatic shadows",
        "rim light", "backlit", "natural daylight", "low key", "high key",
        "volumetric light", "moody dark", "cinematic lighting", "rembrandt lighting", "butterfly lighting",
        "split lighting", "loop lighting", "broad lighting", "short lighting", "silhouette",
        "blue hour", "god rays", "lens flare", "bioluminescent", "candlelight",
        "firelight", "strobe", "ambient occlusion", "global illumination", "ray tracing"
    ],
    mood: [
        "calm", "dreamy", "energetic", "mysterious", "dark",
        "romantic", "cozy", "epic", "playful", "minimal",
        "luxurious", "futuristic", "melancholic", "nostalgic", "whimsical",
        "eerie", "serene", "chaotic", "peaceful", "tense",
        "joyful", "sorrowful", "hopeful", "desolate", "inspiring",
        "magical", "ethereal", "grounded", "bizarre", "surreal"
    ],
    camera: [
        "35mm lens", "50mm lens", "85mm portrait lens", "wide angle", "telephoto",
        "DSLR", "mirrorless", "film camera", "polaroid", "fisheye",
        "cinema camera", "IMAX", "drone", "GoPro", "vintage camera",
        "pinhole camera", "large format", "medium format", "macro lens", "tilt-shift lens",
        "anamorphic lens", "primes", "zoom lens", "night vision", "thermal"
    ],
    subject: [
        "person", "landscape", "product", "animal", "building",
        "food", "nature", "abstract", "vehicle", "interior",
        "cybernetic organism", "fantasy creature", "alien landscape", "space station", "underwater city",
        "historical figure", "fictional character", "robot", "monster", "plant",
        "texture", "pattern", "geometry", "fluid", "explosion"
    ],

    // Video Generation
    duration: [
        "5 second", "10 second", "15 second", "30 second", "1 minute",
        "2 minute", "5 minute", "short clip", "long form", "looping"
    ],
    camera_movement: [
        "tracking shot", "handheld", "steadycam", "dolly zoom", "static",
        "pan", "tilt", "crane shot", "drone flyover", "gimbal smooth",
        "zoom in", "zoom out", "truck left", "truck right", "pedestal up",
        "pedestal down", "arc shot", "whip pan", "rack focus", "orbit"
    ],
    fps: [
        "24fps cinematic", "30fps standard", "60fps smooth", "120fps slow motion", "240fps ultra slow-mo",
        "time-lapse", "hyper-lapse", "stop motion", "step printing", "variable frame rate"
    ],

    // Writing
    tone: [
        "professional", "casual", "friendly", "formal", "humorous",
        "persuasive", "informative", "inspirational", "conversational", "authoritative",
        "empathetic", "analytical", "critical", "optimistic", "pessimistic",
        "sarcastic", "witty", "dramatic", "urgent", "calm",
        "didactic", "satirical", "narrative", "descriptive", "academic"
    ],
    format: [
        "blog post", "article", "essay", "email", "social media post",
        "product description", "story", "script", "tutorial", "guide",
        "whitepaper", "case study", "press release", "newsletter", "speech",
        "poem", "song lyrics", "resume", "cover letter", "manifesto",
        "report", "memo", "tweet", "caption", "book chapter"
    ],
    topic: [
        "technology", "business", "health", "lifestyle", "education",
        "entertainment", "travel", "food", "fashion", "sports",
        "science", "politics", "history", "art", "music",
        "philosophy", "psychology", "environment", "finance", "real estate",
        "marketing", "design", "coding", "gaming", "relationships"
    ],
    audience: [
        "general public", "professionals", "beginners", "experts", "students",
        "business owners", "developers", "marketers", "children", "teenagers",
        "seniors", "parents", "educators", "investors", "policymakers",
        "gamers", "artists", "scientists", "health enthusiasts", "tech enthusiasts"
    ],
    length: [
        "short (100-300 words)", "medium (300-700 words)", "long (700-1500 words)", "comprehensive (1500+ words)",
        "tweet (280 chars)", "elevator pitch (30 sec)", "novel (50k+ words)", "novella (20k-50k words)", "short story (1k-7.5k words)"
    ],

    // Coding
    language: [
        "JavaScript", "TypeScript", "Python", "Java", "C++",
        "Go", "Rust", "PHP", "Ruby", "Swift",
        "Kotlin", "C#", "Scala", "Dart", "Lua",
        "HTML/CSS", "SQL", "NoSQL", "Shell/Bash", "PowerShell",
        "R", "Matlab", "Julia", "Perl", "Haskell",
        "Assembly", "Objective-C", "Visual Basic", "Solidity", "Verilog"
    ],
    task: [
        "API endpoint", "data validation", "authentication", "database query", "file processing",
        "algorithm", "UI component", "utility function", "unit test", "integration test",
        "script", "migration", "configuration", "documentation", "refactoring",
        "optimization", "security audit", "bug fix", "new feature", "deployment pipeline",
        "machine learning model", "data visualization", "game logic", "smart contract", "mobile view"
    ],
    framework: [
        "React", "Vue", "Angular", "Next.js", "Express",
        "Django", "Flask", "Spring Boot", "Laravel", "Rails",
        "Svelte", "Remix", "NestJS", "FastAPI", "ASP.NET Core",
        "Flutter", "React Native", "SwiftUI", "Jetpack Compose", "Electron",
        "Tailwind CSS", "Bootstrap", "Material UI", "TensorFlow", "PyTorch",
        "Pandas", "NumPy", "Unity", "Unreal Engine", "Godot"
    ],
    features: [
        "error handling", "TypeScript types", "unit tests", "comments", "async/await",
        "validation", "logging", "performance optimization", "accessibility", "responsive design",
        "security best practices", "code splitting", "caching", "design patterns", "clean code",
        "JSDoc", "type safety", "immutability", "functional programming", "object-oriented programming",
        "dependency injection", "state management", "i18n", "analytics", "SEO optimization"
    ]
};
