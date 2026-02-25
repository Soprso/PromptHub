export interface SharedPrompt {
    id: string;
    title: string;
    content: string;
    tags: string[];
    model: string;
    like_count: number;
    created_at: string;
}

export interface PromptsResponse {
    prompts: SharedPrompt[];
    total: number;
}

export const communityApi = {
    async submitPrompt(prompt: { title: string; content: string; tags: string[]; model: string }) {
        const response = await fetch('/api/community-prompts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.VITE_COMMUNITY_API_KEY || '',
            },
            body: JSON.stringify(prompt),
        });
        if (!response.ok) throw new Error('Failed to submit prompt');
    },

    async getPrompts(page: number = 1, perPage: number = 20, searchQuery?: string): Promise<PromptsResponse> {
        try {
            const url = new URL('/api/community-prompts', window.location.origin);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('perPage', perPage.toString());
            if (searchQuery) url.searchParams.append('searchQuery', searchQuery);
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Failed to fetch prompts');
            return await response.json();
        } catch (error) {
            console.error('Error fetching prompts:', error);
            return { prompts: [], total: 0 };
        }
    },

    async getRecentPrompts(limit = 50): Promise<SharedPrompt[]> {
        const response = await this.getPrompts(1, limit);
        return response.prompts;
    },

    async incrementLike(id: string) {
        const response = await fetch('/api/community-prompts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'like', id }),
        });
        if (!response.ok) throw new Error('Failed to increment like');
    },
};
