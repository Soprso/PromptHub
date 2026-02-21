import Replicate from 'replicate';

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

export const handler = async (event: any) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        if (!REPLICATE_API_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: "Server configuration missing: REPLICATE_API_KEY" }) };
        }

        const bodyText = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
        const body = JSON.parse(bodyText);
        const { predictionId } = body;

        if (!predictionId) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing predictionId" }) };
        }

        const replicate = new Replicate({ auth: REPLICATE_API_KEY });
        const prediction = await replicate.predictions.get(predictionId);

        if (prediction.status === "succeeded") {
            const swapImageUrl = prediction.output.toString();

            console.log("Face swap succeeded! Returning directly from codeplugtech...");

            return {
                statusCode: 200,
                body: JSON.stringify({ status: "succeeded", url: swapImageUrl })
            };
        }

        if (prediction.status === "failed" || prediction.status === "canceled") {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: `Prediction ${prediction.status}` })
            };
        }

        // still processing or starting
        return {
            statusCode: 200,
            body: JSON.stringify({ status: prediction.status })
        };

    } catch (err: any) {
        console.error("check-headswap error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err?.message || "Internal server error" })
        };
    }
};
