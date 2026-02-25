import { getUserKey } from './user';

export interface PromptStats {
    count: number;
    hasLiked: boolean;
}

export const getPromptStats = async (promptId: string): Promise<PromptStats> => {
    const userKey = getUserKey();
    try {
        const response = await fetch(`/api/prompts?slug=${encodeURIComponent(promptId)}&userKey=${encodeURIComponent(userKey)}`);
        if (!response.ok) throw new Error('Failed to fetch prompt stats');
        const data = await response.json();
        return { count: data.count || 0, hasLiked: !!data.hasLiked };
    } catch (error) {
        console.error('Error fetching prompt stats:', error);
        return { count: 0, hasLiked: false };
    }
};

export const toggleLike = async (promptId: string, currentLikedState: boolean): Promise<boolean> => {
    const userKey = getUserKey();
    try {
        const response = await fetch('/api/likes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promptId, userKey, currentLikedState }),
        });
        if (!response.ok) throw new Error('Failed to toggle like');
        const data = await response.json();
        return data.newState;
    } catch (error) {
        console.error('Error toggling like:', error);
        return currentLikedState;
    }
};
