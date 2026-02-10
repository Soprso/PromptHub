import { promptCategories } from "../data/prompts";
import { seoPages } from "../data/seo-pages";
import { communityApi, type SharedPrompt } from "../lib/communityApi";
import type { PromptFolder, PromptCategory } from "../types/prompt";

export interface SearchResult {
    type: 'prompt' | 'guide' | 'guide-prompt' | 'community';
    prompt: { title: string; content?: string; id?: string };
    category?: PromptCategory;
    folder?: PromptFolder;
    path: string;
    slug?: string; // For guides
    communityPrompt?: SharedPrompt; // For community prompts
}

// Cache for community prompts to avoid refetching on every keystroke
let communityPromptsCache: SharedPrompt[] = [];
let lastCacheFetch = 0;
const CACHE_DURATION = 60000; // 1 minute

async function getCommunityPrompts(): Promise<SharedPrompt[]> {
    const now = Date.now();
    if (now - lastCacheFetch < CACHE_DURATION && communityPromptsCache.length > 0) {
        return communityPromptsCache;
    }

    try {
        // Fetch up to 100 recent community prompts for search
        const response = await communityApi.getPrompts(1, 100);
        communityPromptsCache = response.prompts;
        lastCacheFetch = now;
        return communityPromptsCache;
    } catch (error) {
        console.error('Error fetching community prompts for search:', error);
        return [];
    }
}

export async function searchPrompts(query: string): Promise<SearchResult[]> {
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

        // 3. Search Community Prompts
        const communityPrompts = await getCommunityPrompts();
        communityPrompts.forEach((prompt) => {
            const titleMatch = prompt.title.toLowerCase().includes(lowerQuery);
            const contentMatch = prompt.content.toLowerCase().includes(lowerQuery);
            const tagsMatch = prompt.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

            if (titleMatch || contentMatch || tagsMatch) {
                results.push({
                    type: 'community',
                    prompt: { title: prompt.title, content: prompt.content, id: prompt.id },
                    path: 'Community',
                    communityPrompt: prompt
                });
            }
        });

        return results;
    } catch (error) {
        console.error("Error in searchPrompts:", error);
        return [];
    }
}
