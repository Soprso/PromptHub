import { supabase } from './supabase';

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
        if (!supabase) throw new Error("Supabase not initialized");

        const { error } = await supabase
            .from('prompts_shared')
            .insert([prompt]);

        if (error) throw error;
    },

    async getPrompts(page: number = 1, perPage: number = 20, searchQuery?: string): Promise<PromptsResponse> {
        if (!supabase) return { prompts: [], total: 0 };

        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        let query = supabase
            .from('prompts_shared')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        // Apply search filter if provided
        if (searchQuery && searchQuery.trim()) {
            const searchTerm = `%${searchQuery.trim()}%`;
            query = query.or(`title.ilike.${searchTerm},content.ilike.${searchTerm},tags.cs.{${searchQuery.trim()}}`);
        }

        // Apply pagination
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching prompts:', error);
            return { prompts: [], total: 0 };
        }

        return {
            prompts: data || [],
            total: count || 0
        };
    },

    // Keep the old method for backward compatibility
    async getRecentPrompts(limit = 50): Promise<SharedPrompt[]> {
        const response = await this.getPrompts(1, limit);
        return response.prompts;
    },

    async incrementLike(id: string) {
        if (!supabase) {
            console.error('Supabase client not initialized');
            throw new Error('Database connection not available');
        }

        console.log('Attempting to increment like for prompt:', id);

        // Use RPC if available, otherwise fallback to simple update (less safe but functional for MVPs)
        // We will try RPC first as it is in the schema guide.
        const { error: rpcError } = await supabase.rpc('increment_shared_prompt_like', { row_id: id });

        if (rpcError) {
            console.warn('RPC Error, falling back to simple update:', rpcError);
            // Fallback: Get current -> Increment -> Update
            // Note: This has race conditions, but fine for MVP if RPC fails/doesn't exist yet
            const { data, error: fetchError } = await supabase
                .from('prompts_shared')
                .select('like_count')
                .eq('id', id)
                .single();

            if (fetchError) {
                console.error('Error fetching prompt for like update:', fetchError);
                throw fetchError;
            }

            if (data) {
                const newLikeCount = (data.like_count || 0) + 1;
                const { error: updateError } = await supabase
                    .from('prompts_shared')
                    .update({ like_count: newLikeCount })
                    .eq('id', id);

                if (updateError) {
                    console.error('Error updating like count:', updateError);
                    throw updateError;
                }

                console.log('Successfully updated like count to:', newLikeCount);
            }
        } else {
            console.log('Successfully incremented like via RPC');
        }
    }
};
