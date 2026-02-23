import { supabase } from './supabase';

export interface ImageOfDay {
    id: string;
    image_url: string;
    prompt: string;
    likes: number;
    created_at: string;
    is_active: boolean;
}

export const imageOfDayApi = {
    async getTopImage(): Promise<ImageOfDay | null> {
        return this.getImageOfDay();
    },

    async getImageOfDay(): Promise<ImageOfDay | null> {
        if (!supabase) {
            console.error("Supabase not initialized");
            return null;
        }

        const { data, error } = await supabase
            .from('image_of_day')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Error fetching image of the day:', error);
            return null;
        }

        return data;
    },

    async getLatestImages(limit: number = 5): Promise<ImageOfDay[]> {
        if (!supabase) {
            console.error("Supabase not initialized");
            return [];
        }

        const { data, error } = await supabase
            .from('image_of_day')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching latest images:', error);
            return [];
        }

        return data || [];
    },

    async getPaginatedImages(page: number, limit: number = 10): Promise<{ data: ImageOfDay[], count: number }> {
        if (!supabase) {
            console.error("Supabase not initialized");
            return { data: [], count: 0 };
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('image_of_day')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Error fetching paginated images:', error);
            return { data: [], count: 0 };
        }

        return {
            data: data || [],
            count: count || 0
        };
    },

    async uploadImage(file: File): Promise<{ url: string | null; error: any }> {
        if (!supabase) {
            return { url: null, error: "Supabase not initialized" };
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('image_of_day')
            .upload(filePath, file);

        if (uploadError) {
            return { url: null, error: uploadError };
        }

        const { data } = supabase.storage
            .from('image_of_day')
            .getPublicUrl(filePath);

        return { url: data.publicUrl, error: null };
    },

    async insertImageOfDay(image: { image_url: string; prompt: string; likes: number }): Promise<boolean> {
        if (!supabase) {
            console.error("Supabase not initialized");
            return false;
        }

        const { error } = await supabase
            .from('image_of_day')
            .insert([image]);

        if (error) {
            console.error('Error inserting image of the day:', error);
            return false;
        }

        return true;
    },

    async likeImageOfDay(id: string): Promise<boolean> {
        if (!supabase) {
            console.error('Supabase client not initialized');
            return false;
        }

        // Try RPC first if it exists (e.g., increment_image_of_day_like)
        const { error: rpcError } = await supabase.rpc('increment_image_of_day_like', { row_id: id });

        if (rpcError) {
            // Fallback to simple select -> update (has race condition, but functional)
            const { data, error: fetchError } = await supabase
                .from('image_of_day')
                .select('likes')
                .eq('id', id)
                .single();

            if (fetchError || !data) {
                console.error('Error fetching image of day for like update:', fetchError);
                return false;
            }

            const newLikes = (data.likes || 0) + 1;
            const { error: updateError } = await supabase
                .from('image_of_day')
                .update({ likes: newLikes })
                .eq('id', id);

            if (updateError) {
                console.error('Error updating image of day likes:', updateError);
                return false;
            }
        }

        return true;
    }
};
