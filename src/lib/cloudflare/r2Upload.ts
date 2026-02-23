export async function r2Upload(file: File): Promise<string> {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only PNG, JPEG, and WEBP are allowed.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
        throw new Error('File exceeds the 5MB size limit.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/.netlify/functions/upload-image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload image to R2');
        }

        const data = await response.json();
        return data.url;
    } catch (error: any) {
        console.error('Upload Error:', error);
        throw error;
    }
}
