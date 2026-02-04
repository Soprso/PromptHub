import { promptCategories } from "../data/prompts";
import type { Prompt, PromptFolder, PromptCategory } from "../types/prompt";

export interface SearchResult {
    prompt: Prompt;
    category: PromptCategory;
    folder: PromptFolder;
    path: string;
}

export function searchPrompts(query: string): SearchResult[] {
    if (!query.trim()) return [];

    try {
        const lowerQuery = query.toLowerCase();
        const results: SearchResult[] = [];

        if (!promptCategories || !Array.isArray(promptCategories)) {
            console.error("promptCategories is not available or not an array");
            return [];
        }

        promptCategories.forEach((category) => {
            if (!category || !category.folders || !Array.isArray(category.folders)) {
                return;
            }

            category.folders.forEach((folder) => {
                if (!folder || !folder.prompts || !Array.isArray(folder.prompts)) {
                    return;
                }

                folder.prompts.forEach((prompt) => {
                    if (!prompt || !prompt.title || !prompt.content) {
                        return;
                    }

                    try {
                        // Search in title and content
                        const titleMatch = prompt.title.toLowerCase().includes(lowerQuery);
                        const contentMatch = prompt.content.toLowerCase().includes(lowerQuery);

                        if (titleMatch || contentMatch) {
                            results.push({
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

        return results;
    } catch (error) {
        console.error("Error in searchPrompts:", error);
        return [];
    }
}
