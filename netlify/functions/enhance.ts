import type { Handler, HandlerEvent } from "@netlify/functions";
import { Client } from "@gradio/client";

// Netlify Function: POST /api/enhance
// Receives { imageUrl: string }
// Calls sczhou/CodeFormer server-side (no CORS issues)
// Returns { url: string } - the enhanced image URL

export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { imageUrl } = JSON.parse(event.body || "{}");

        if (!imageUrl) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "imageUrl is required" })
            };
        }

        // Download the image to pass to CodeFormer
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
        const imageBlob = await response.blob();

        // Call sczhou/CodeFormer via Gradio client (server-side = no CORS)
        const client = await Client.connect("sczhou/CodeFormer");
        const result = await Promise.race([
            client.predict("/inference", [
                imageBlob, // image
                true,      // face_align
                false,     // background_enhance
                true,      // face_upsample
                2,         // upscale
                0.7        // codeformer_fidelity (0=gen quality, 1=fidelity)
            ]),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("CodeFormer timeout (60s)")), 60000)
            )
        ]);

        const data = (result as any).data as any[];
        const out = data[0];
        let url: string = out?.url || "";
        if (url && !url.startsWith("http")) {
            url = `https://sczhou-codeformer.hf.space/gradio_api/file=${url}`;
        }

        if (!url) throw new Error("No image URL returned from CodeFormer");

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        };

    } catch (err: any) {
        console.error("[enhance] Error:", err.message);
        // Return a non-critical error — caller should use original image as fallback
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Enhancement failed" })
        };
    }
};
