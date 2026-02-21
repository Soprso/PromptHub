import Replicate from 'replicate';

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

export const handler = async (event: any) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        if (!REPLICATE_API_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: "Server configuration missing: REPLICATE_API_KEY" }) };
        }

        const body = JSON.parse(event.body);
        const { predictionId } = body;

        if (!predictionId) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing predictionId" }) };
        }

        const replicate = new Replicate({ auth: REPLICATE_API_KEY });
        const prediction = await replicate.predictions.get(predictionId);

        if (prediction.status === "succeeded") {
            const replicateOutput = prediction.output;
            let url = "";

            console.log("Replicate polling raw output:", replicateOutput);

            if (Array.isArray(replicateOutput)) {
                if (typeof replicateOutput[0] === "string") {
                    url = replicateOutput[0];
                } else if (replicateOutput[0]?.url) {
                    url = replicateOutput[0].url;
                } else {
                    return { statusCode: 500, body: JSON.stringify({ error: "Replicate returned unexpected output format" }) };
                }
            } else if (typeof replicateOutput === "string") {
                url = replicateOutput;
            } else if (replicateOutput && typeof replicateOutput === "object" && (replicateOutput as any).url) {
                url = (replicateOutput as any).url;
            } else {
                return { statusCode: 500, body: JSON.stringify({ error: "Replicate output is not an array" }) };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ status: "succeeded", url })
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
