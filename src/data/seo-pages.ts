export interface SeoPageData {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    intro: string;
    prompts: {
        title: string;
        content: string;
    }[];
    cta: string;
}

export const seoPages: SeoPageData[] = [
    {
        slug: "how-to-write-better-prompts",
        title: "How to Write Better AI Prompts (Step-by-Step Guide)",
        metaTitle: "How to Write Better AI Prompts: The Ultimate Guide for 2024",
        metaDescription: "Learn the secrets of prompt engineering. Disocver proven formulas, templates, and tips to get the best results from ChatGPT, Claude, and Midjourney.",
        intro: "Mastering the art of prompt engineering is the key to unlocking the full potential of AI. Whether you're using ChatGPT for writing, Midjourney for art, or Claude for coding, the quality of your output depends entirely on the quality of your input. In this guide, we've compiled the most effective prompt structures and examples to help you go from zero to pro.",
        prompts: [
            {
                title: "The CO-STAR Framework",
                content: "Context: [Insert Context]\nObjective: [Insert Goal]\nStyle: [Insert Style]\nTone: [Insert Tone]\nAudience: [Insert Audience]\nResponse: [Insert Format]"
            },
            {
                title: "Chain of Thought Prompting",
                content: "I want you to solve this problem step-by-step. For each step, explain your reasoning before moving to the next one. Finally, provide the conclusion based on the steps above."
            },
            {
                title: "Role-Playing Persona",
                content: "Act as an expert [Role, e.g., Python Developer]. You have 20 years of experience in [Field]. Your task is to [Task]. avoiding common pitfalls like [Mistake 1] and [Mistake 2]."
            },
            {
                title: "Few-Shot Prompting (Examples)",
                content: "Classify the sentiment of these reviews:\n\nReview: \"The food was cold.\"\nSentiment: Negative\n\nReview: \"I loved the ambiance!\"\nSentiment: Positive\n\nReview: \"Service was okay, but slow.\"\nSentiment: Neutral\n\nReview: [Insert New Review]\nSentiment:"
            }
        ],
        cta: "Ready to explore more? Browse our full library of 2000+ free prompts."
    },
    {
        slug: "prompts-for-content-writers",
        title: "Best ChatGPT Prompts for Content Writers & Bloggers",
        metaTitle: "50+ Best ChatGPT Prompts for Content Writers (SEO Optimized)",
        metaDescription: "Supercharge your writing workflow with these battle-tested ChatGPT prompts. From blog post outlines to SEO optimization and viral hooks.",
        intro: "Content writing is evolving. To stay ahead, you need to leverage AI not just to write, but to brainstorm, structure, and refine your work. These prompts are designed specifically for content creators, copywriters, and bloggers who want to produce high-quality, human-sounding content at scale.",
        prompts: [
            {
                title: "Blog Post Outline Generator",
                content: "Create a comprehensive outline for a blog post titled \"[Title]\". Include H2 and H3 headings, bullet points for key arguments under each section, and a suggestion for a compelling introduction and conclusion."
            },
            {
                title: "SEO Meta Description Creator",
                content: "Write 5 variations of an SEO-friendly meta description for a page about \"[Topic]\". Keep them under 160 characters, include the keyword \"[Keyword]\", and use an active voice with a clear call to action."
            },
            {
                title: "Content Repurposing (Blog to Social)",
                content: "Take the following blog section and repurpose it into:\n1. A Twitter thread (5 tweets)\n2. A LinkedIn post (professional tone)\n3. An Instagram caption (engaging and casual)\n\n[Insert Blog Content]"
            },
            {
                title: "Tone & Style Editor",
                content: "Rewrite the following text to sound more [Adjective, e.g., authoritative, witty, empathetic]. Keep the core message the same but adjust the vocabulary and sentence structure to match this new tone.\n\n[Insert Text]"
            }
        ],
        cta: "Need more writing inspiration? Check out our Writing category."
    },
    {
        slug: "midjourney-logo-prompts",
        title: "Midjourney Logo Prompts: Create Professional Brand Marks",
        metaTitle: "Best Midjourney Logo Prompts for Startups & Brands",
        metaDescription: "Copy-paste these Midjourney prompts to generate stunning logos. Minimalist, mascot, vintage, and futuristic styles included.",
        intro: "Designing a logo can be expensive and time-consuming. With Midjourney, you can generate hundreds of high-quality concepts in minutes. The secret lies in using the right style keywords and parameters. These prompts cover a wide range of aesthetic styles to help you find the perfect visual identity for your brand.",
        prompts: [
            {
                title: "Minimalist Tech Startup Logo",
                content: "/imagine prompt: a minimalist logo for a tech startup named \"Nebula\", abstract geometric shape of a cloud and digital nodes, vector art, flat design, white background, navy blue and cyan color palette, clean lines --v 6.0"
            },
            {
                title: "Vintage Coffee Shop Emblem",
                content: "/imagine prompt: a vintage emblem logo for a coffee shop, illustration of a steaming coffee cup with retro typography, circular badge style, textured paper background, earthy brown and cream colors, intricate details --v 6.0"
            },
            {
                title: "Modern 3D App Icon",
                content: "/imagine prompt: a 3D app icon for a meditation app, soft rounded square shape, floating lotus flower, glassmorphism style, soft pastel gradients, subsurface scattering, high gloss --v 6.0"
            },
            {
                title: "Mascot Logo for E-Sports Team",
                content: "/imagine prompt: a fierce mascot logo for an e-sports team named \"Thunder Wolves\", stylized wolf head with lightning bolt eyes, bold vector lines, aggressive expression, neon blue and black colors, sticker style --v 6.0"
            }
        ],
        cta: "Want to create more art? Visit our AI Image Generation collection."
    }
];
