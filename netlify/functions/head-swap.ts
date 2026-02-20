import type { Handler, HandlerEvent } from "@netlify/functions";
import { Client } from "@gradio/client";

// Netlify Function: POST /api/head-swap
// Receives { srcBase64: string, targetBase64: string }
// Calls tonyassi/face-swap server-side (no CORS issues)
// Returns { url: string } - the swapped image URL

export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { srcBase64, targetBase64 } = JSON.parse(event.body || "{}");

        if (!srcBase64 || !targetBase64) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "srcBase64 and targetBase64 are required" })
            };
        }

        // Convert base64 data URLs to Blobs
        const srcBlob = dataURLToBlob(srcBase64);
        const targetBlob = dataURLToBlob(targetBase64);

        // Call tonyassi/face-swap via Gradio client (server-side = no CORS)
        const client = await Client.connect("tonyassi/face-swap");
        const result = await Promise.race([
            client.predict("/swap_faces", [srcBlob, targetBlob]),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Face swap timeout (60s)")), 60000)
            )
        ]);

        const data = (result as any).data as any[];
        const out = data[0];
        const url: string = out?.url || `https://tonyassi-face-swap.hf.space/gradio_api/file=${out?.path}`;

        if (!url || url.includes("undefined")) {
            throw new Error("No image URL in response");
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        };

    } catch (err: any) {
        console.error("[head-swap] Error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Head swap failed" })
        };
    }
};

function dataURLToBlob(dataURL: string): Blob {
    const [header, base64Data] = dataURL.split(",");
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
}
