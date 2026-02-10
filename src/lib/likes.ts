import { supabase } from './supabase';
import { getUserKey } from './user';

export interface PromptStats {
    count: number;
    hasLiked: boolean;
}

// Fetch like status and count for a specific prompt
export const getPromptStats = async (promptId: string): Promise<PromptStats> => {
    if (!supabase) {
        console.warn('Supabase not configured. Likes functionality disabled.');
        return { count: 0, hasLiked: false };
    }

    const userKey = getUserKey();

    // 1. Get the prompt record (or create one if it doesn't exist yet)
    const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .select('like_count')
        .eq('slug', promptId) // Using slug as the ID since that's what we have in frontend
        .single();

    if (promptError && promptError.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching prompt stats:', promptError);
        return { count: 0, hasLiked: false };
    }

    let count = 0;
    if (promptData) {
        count = promptData.like_count || 0;
    } else {
        // Prompt doesn't exist in DB yet, so count is 0
    }

    // 2. Check if THIS user has liked it
    const { data: likeData, error: likeError } = await supabase
        .from('likes')
        .select('id')
        .eq('prompt_slug', promptId) // We'll store slug in likes table for easier join/lookup without complex FK gymnastics initially
        .eq('user_key', userKey)
        .single();

    if (likeError && likeError.code !== 'PGRST116') {
        console.error('Error checking user like status:', likeError);
    }

    return {
        count,
        hasLiked: !!likeData
    };
};


export const toggleLike = async (promptId: string, currentLikedState: boolean): Promise<boolean> => {
    if (!supabase) {
        console.warn('Supabase not configured. Likes functionality disabled.');
        return currentLikedState;
    }

    const userKey = getUserKey();
    const newLikedState = !currentLikedState;

    if (newLikedState) {
        // User is LIKING
        // 1. Ensure prompt exists (upsert)
        // We do this to ensure the prompt row exists so we can increment its count
        await supabase.from('prompts').upsert(
            { slug: promptId, title: promptId }, // Just using slug as title fallback for now
            { onConflict: 'slug' }
        );

        // 2. Insert into likes table
        const { error: insertError } = await supabase
            .from('likes')
            .insert({ prompt_slug: promptId, user_key: userKey });

        if (insertError) {
            if (insertError.code === '23505') { // Unique violation, already liked
                return true;
            }
            throw insertError;
        }

        // 3. Increment count
        await supabase.rpc('increment_like_count', { row_slug: promptId });

    } else {
        // User is UNLIKING
        // 1. Delete from likes table
        const { error: deleteError } = await supabase
            .from('likes')
            .delete()
            .eq('prompt_slug', promptId)
            .eq('user_key', userKey);

        if (deleteError) throw deleteError;

        // 2. Decrement count
        await supabase.rpc('decrement_like_count', { row_slug: promptId });
    }

    return newLikedState;
};
