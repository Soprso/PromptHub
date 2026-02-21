/// <reference path="../../src/types/parse-multipart-data.d.ts" />
import type { Handler, HandlerEvent } from "@netlify/functions";
import { Client } from "@gradio/client";
import multipart from "parse-multipart-data"; // We need this to parse FormData in classic Netlify Functions

// Netlify Function: POST /api/head-swap
// Receives multipart/form-data with `source` and `target` blobs.
// Calls tonyassi/face-swap followed by sczhou/CodeFormer (combined server pipeline)
// Returns { url: string } - the final enhanced image URL

// Persistent clients across Lambda warm boots
let swapClient: any = null;
let enhanceClient: any = null;

export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // 1. Extract Boundary and Parse Multipart Form Data
        const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
        const boundaryMatch = contentType.match(/boundary=(.+)$/i);
        if (!boundaryMatch) {
            return { statusCode: 400, body: JSON.stringify({ error: "No boundary found in Content-Type" }) };
        }

        const boundary = boundaryMatch[1];
        // Netlify base64 encodes binary payloads
        const bodyBuffer = event.isBase64Encoded && event.body
            ? Buffer.from(event.body, "base64")
            : Buffer.from(event.body || "", "utf8");

        const parts = multipart.parse(bodyBuffer, boundary);

        const sourcePart = parts.find((p: any) => p.name === "source");
        const targetPart = parts.find((p: any) => p.name === "target");

        if (!sourcePart || !targetPart) {
            return { statusCode: 400, body: JSON.stringify({ error: "Source and Target BLOBs are required" }) };
        }

        const srcBlob = new Blob([sourcePart.data], { type: sourcePart.type || "image/jpeg" });
        const targetBlob = new Blob([targetPart.data], { type: targetPart.type || "image/jpeg" });

        // 2. Persistent HF Clients
        if (!swapClient) {
            swapClient = await Client.connect("tonyassi/face-swap");
        }
        if (!enhanceClient) {
            enhanceClient = await Client.connect("sczhou/CodeFormer");
        }

        // 3. AI Stage 1: Face Swap
        const swapResult = await Promise.race([
            swapClient.predict("/swap_faces", [srcBlob, targetBlob]),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Face swap timeout (60s)")), 60000))
        ]);

        const swapData = (swapResult as any).data as any[];
        const swapOut = swapData[0];
        const swapUrl: string = swapOut?.url || `https://tonyassi-face-swap.hf.space/gradio_api/file=${swapOut?.path}`;

        if (!swapUrl || swapUrl.includes("undefined")) {
            throw new Error("No image URL in swap response");
        }

        // 4. Download swapped image temporarily to feed into CodeFormer
        const swapRes = await fetch(swapUrl);
        if (!swapRes.ok) throw new Error("Could not download intermediate swap result for enhancement");
        const intermediateBlob = await swapRes.blob();

        // 5. AI Stage 2: Enhance Details (CodeFormer)
        try {
            const enhanceResult = await Promise.race([
                enhanceClient.predict("/inference", [
                    intermediateBlob, // image
                    true,      // face_align
                    false,     // background_enhance
                    true,      // face_upsample
                    2,         // upscale
                    0.7        // codeformer_fidelity
                ]),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error("CodeFormer timeout (60s)")), 60000))
            ]);

            const enhData = (enhanceResult as any).data as any[];
            const enhOut = enhData[0];
            let enhUrl: string = enhOut?.url || "";
            if (enhUrl && !enhUrl.startsWith("http")) {
                enhUrl = `https://sczhou-codeformer.hf.space/gradio_api/file=${enhUrl}`;
            }

            // Return the enhanced URL if successful
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: enhUrl || swapUrl })
            };
        } catch (enhanceErr: any) {
            console.warn("[head-swap pipeline] CodeFormer failed, falling back to raw swap:", enhanceErr.message);
            // Non-critical: Fallback to returning the raw swapped face
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: swapUrl })
            };
        }

    } catch (err: any) {
        console.error("[head-swap pipeline] Error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Unified Head Swap pipeline failed" })
        };
    }
};
