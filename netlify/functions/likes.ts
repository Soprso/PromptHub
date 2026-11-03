import { supabaseAdmin } from './supabase-client';

export interface PromptStats {
  count: number;
  hasLiked: boolean;
}

// GET /api/prompts?slug=&userKey= - Get prompt stats and like status
export const getPromptStats = async (promptId: string, userKey: string) => {
  const userKeyEncoded = encodeURIComponent(userKey);
  const promptIdEncoded = encodeURIComponent(promptId);

  try {
    const response = await fetch(`/api/prompts?slug=${promptIdEncoded}&userKey=${userKeyEncoded}`);
    if (!response.ok) throw new Error('Failed to fetch prompt stats');
    const data = await response.json();
    return { count: data.count || 0, hasLiked: !!data.hasLiked };
  } catch (error) {
    console.error('Error fetching prompt stats:', error);
    return { count: 0, hasLiked: false };
  }
};

// POST /api/likes - Toggle like on a prompt
export const toggleLike = async (promptId: string, currentLikedState: boolean) => {
  const userKey = localStorage.getItem('phub_user_key') || 'anonymous';

  try {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ promptId, userKey, currentLikedState }),
    });
    if (!response.ok) throw new Error('Failed to toggle like');
    const data = await response.json();
    return data.newState;
  } catch (error) {
    console.error('Error toggling like:', error);
    return currentLikedState;
  }
  // Note: The actual like/dislike logic is handled in the Netlify function
  // This frontend function is kept for compatibility but the real
  // logic is in netlify/functions/likes.ts which uses Supabase
  return currentLikedState;
};