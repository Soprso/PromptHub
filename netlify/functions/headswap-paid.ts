import multipart from 'parse-multipart-data';
import crypto from 'crypto';
import Replicate from 'replicate';

const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

export const handler = async (event: any) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        console.log("-- Environment Check (headswap-paid) --");
        console.log("Replicate key exists:", !!REPLICATE_API_KEY);
        console.log("Razorpay secret exists:", !!RAZORPAY_SECRET);

        if (!RAZORPAY_SECRET) {
            console.error("Missing RAZORPAY_SECRET in Netlify environment");
            return { statusCode: 500, body: JSON.stringify({ error: "Server configuration missing: RAZORPAY_SECRET" }) };
        }

        if (!REPLICATE_API_KEY) {
            console.error("Missing REPLICATE_API_KEY in Netlify environment");
            return { statusCode: 500, body: JSON.stringify({ error: "Server configuration missing: REPLICATE_API_KEY" }) };
        }

        // 1. Parse FormData (preserving binary transfer efficiency from frontend)
        const boundary = event.headers['content-type'].split('boundary=')[1];
        const parts = multipart.parse(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'), boundary);

        let sourceImage: any = null;
        let targetImage: any = null;
        let razorpay_payment_id = "";
        let razorpay_order_id = "";
        let razorpay_signature = "";

        for (const part of parts) {
            if (part.name === "source") sourceImage = part;
            else if (part.name === "target") targetImage = part;
            else if (part.name === "razorpay_payment_id") razorpay_payment_id = part.data.toString("utf8");
            else if (part.name === "razorpay_order_id") razorpay_order_id = part.data.toString("utf8");
            else if (part.name === "razorpay_signature") razorpay_signature = part.data.toString("utf8");
        }

        if (!sourceImage || !targetImage) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing source or target images" }) };
        }

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing Payment Verification Details" }) };
        }

        // 2. CRITICAL: Verify payment signature BEFORE doing anything else
        const hmac = crypto.createHmac('sha256', RAZORPAY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature !== razorpay_signature) {
            console.error("Invalid payment signature!", { expected: generated_signature, received: razorpay_signature });
            return { statusCode: 403, body: JSON.stringify({ error: "Invalid payment signature" }) };
        }

        console.log("Payment Verified! Initiating Replicate model...");

        // 3. Format inputs for Replicate (re-assembling the optimized Buffer into Data URI immediately in memory)
        const sourceDataUri = `data:${sourceImage.type};base64,${sourceImage.data.toString("base64")}`;
        const targetDataUri = `data:${targetImage.type};base64,${targetImage.data.toString("base64")}`;

        // 4. Run Replicate (with strict polling timeout)
        const replicate = new Replicate({ auth: REPLICATE_API_KEY });

        let url: string | null = null;

        // Wrap replicate execution in a custom Promise to enforce a strict timeout (e.g. 120s max execution)
        try {
            const replicatePromise = replicate.run(
                "easel-ai/advanced-face-swap",
                {
                    input: {
                        swap_image: sourceDataUri,
                        target_image: targetDataUri
                    }
                }
            );

            // 120 seconds timeout logic
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error("Replicate Inference Timeout (120s exceeded)")), 120000);
            });

            const output: any = await Promise.race([replicatePromise, timeoutPromise]);
            // Output is usually the URL string depending on the model's schema
            if (Array.isArray(output) && output.length > 0) {
                url = output[0];
            } else if (typeof output === 'string') {
                url = output;
            } else {
                url = output;
            }
        } catch (apiErr: any) {
            console.error("Replicate API Error:", apiErr);
            return { statusCode: 502, body: JSON.stringify({ error: `Replicate failed: ${apiErr?.message || "Unknown error"}` }) };
        }

        if (!url) {
            return { statusCode: 500, body: JSON.stringify({ error: "Failed to get image URL from Replicate" }) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ url })
        };

    } catch (err: any) {
        console.error("headswap-paid error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err?.message || "Internal server error" })
        };
    }
};
