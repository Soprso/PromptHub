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
        try {
            const response = await fetch('/api/image-of-day?type=featured');
            if (!response.ok) throw new Error('Failed to fetch image of day');
            return await response.json();
        } catch (error) {
            console.error('Error fetching image of the day:', error);
            return null;
        }
    },

    async getLatestImages(limit: number = 5): Promise<ImageOfDay[]> {
        try {
            const response = await fetch(`/api/image-of-day?type=latest&limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch latest images');
            return await response.json();
        } catch (error) {
            console.error('Error fetching latest images:', error);
            return [];
        }
    },

    async getPaginatedImages(page: number, limit: number = 10, search: string = ''): Promise<{ data: ImageOfDay[], count: number }> {
        try {
            const searchQuery = search ? `&query=${encodeURIComponent(search)}` : '';
            const response = await fetch(`/api/image-of-day?type=paginated&page=${page}&limit=${limit}${searchQuery}`);
            if (!response.ok) throw new Error('Failed to fetch paginated images');
            return await response.json();
        } catch (error) {
            console.error('Error fetching paginated images:', error);
            return { data: [], count: 0 };
        }
    },

    async searchImages(query: string, limit: number = 20): Promise<ImageOfDay[]> {
        try {
            const response = await fetch(`/api/image-of-day?type=search&query=${encodeURIComponent(query)}&limit=${limit}`);
            if (!response.ok) throw new Error('Failed to search images');
            return await response.json();
        } catch (error) {
            console.error('Error searching images:', error);
            return [];
        }
    },

    async uploadImage(_file: File): Promise<{ url: string | null; error: any }> {
        return { url: null, error: 'Use r2Upload.ts for uploads' };
    },

    async insertImageOfDay(image: { image_url: string; prompt: string; likes: number }): Promise<boolean> {
        try {
            const response = await fetch('/api/image-of-day', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'insert', ...image }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error inserting image of the day:', error);
            return false;
        }
    },

    async likeImageOfDay(id: string): Promise<boolean> {
        try {
            const response = await fetch('/api/image-of-day', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'like', id }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error updating image of day likes:', error);
            return false;
        }
    },
};
