import { promptCategories } from "../data/prompts";
import { seoPages } from "../data/seo-pages";
import type { PromptFolder, PromptCategory } from "../types/prompt";

export interface SearchResult {
    type: 'prompt' | 'guide' | 'guide-prompt';
    prompt: { title: string; content?: string; id?: string };
    category?: PromptCategory;
    folder?: PromptFolder;
    path: string;
    slug?: string; // For guides
}

export function searchPrompts(query: string): SearchResult[] {
    if (!query.trim()) return [];

    try {
        const lowerQuery = query.toLowerCase();
        const results: SearchResult[] = [];

        // 1. Search existing categories
        if (promptCategories && Array.isArray(promptCategories)) {
            promptCategories.forEach((category) => {
                if (!category?.folders) return;

                category.folders.forEach((folder) => {
                    if (!folder?.prompts) return;

                    folder.prompts.forEach((prompt) => {
                        try {
                            const titleMatch = prompt.title.toLowerCase().includes(lowerQuery);
                            const contentMatch = prompt.content.toLowerCase().includes(lowerQuery);

                            if (titleMatch || contentMatch) {
                                results.push({
                                    type: 'prompt',
                                    prompt,
                                    category,
                                    folder,
                                    path: `${category.name} → ${folder.name}`,
                                });
                            }
                        } catch (err) {
                            console.error("Error processing prompt:", err);
                        }
                    });
                });
            });
        }

        // 2. Search SEO Pages (Guides)
        seoPages.forEach((page) => {
            // Check title and intro
            const titleMatch = page.title.toLowerCase().includes(lowerQuery);
            const introMatch = page.intro.toLowerCase().includes(lowerQuery);

            if (titleMatch || introMatch) {
                results.push({
                    type: 'guide',
                    prompt: { title: page.title, content: page.intro },
                    path: 'Guide',
                    slug: page.slug
                });
            }

            // Check individual prompts inside guides
            page.prompts.forEach((prompt) => {
                const pTitleMatch = prompt.title.toLowerCase().includes(lowerQuery);
                const pContentMatch = prompt.content.toLowerCase().includes(lowerQuery);

                if (pTitleMatch || pContentMatch) {
                    results.push({
                        type: 'guide-prompt',
                        prompt: { title: prompt.title, content: prompt.content },
                        path: `Guide: ${page.title}`,
                        slug: page.slug
                    });
                }
            });
        });

        return results;
    } catch (error) {
        console.error("Error in searchPrompts:", error);
        return [];
    }
}
