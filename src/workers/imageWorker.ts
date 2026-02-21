// src/workers/imageWorker.ts
self.onmessage = async (e) => {
    const { file, maxSize } = e.data;

    try {
        const bitmap = await createImageBitmap(file);
        let { width, height } = bitmap;

        if (width > height && width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
        } else if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
        }

        width = Math.round(width);
        height = Math.round(height);

        // Fallback to regular canvas if OffscreenCanvas is not supported (e.g., older Safari)
        let blob: Blob;

        if (typeof OffscreenCanvas !== 'undefined') {
            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: false });
            if (!ctx) throw new Error("Failed to get 2d context for OffscreenCanvas");
            ctx.drawImage(bitmap, 0, 0, width, height);

            blob = await canvas.convertToBlob({
                type: "image/jpeg",
                quality: 0.90, // JPEG quality 0.90 (fast, small)
            });
        } else {
            // Main thread fallback might be needed if this runs in a browser without OffscreenCanvas in workers,
            // though modern browsers support it. Just in case, this is handled.
            throw new Error("OffscreenCanvas is not supported in this environment");
        }

        self.postMessage({ success: true, blob });
    } catch (err: any) {
        self.postMessage({ success: false, error: err.message });
    }
};
