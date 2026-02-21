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

            console.log("Face swap succeeded! Running Codeformer restoration...");

            // Step 4: Quality optimization
            const codeformerOutput = await replicate.run(
                "sczhou/codeformer:cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2",
                {
                    input: {
                        image: swapImageUrl,
                        fidelity: 0.8
                    }
                }
            );

            console.log("Restoration Complete:", codeformerOutput);

            let url = "";
            if (Array.isArray(codeformerOutput)) {
                if (typeof codeformerOutput[0] === "string") {
                    url = codeformerOutput[0];
                } else if (codeformerOutput[0]?.url) {
                    url = codeformerOutput[0].url;
                } else {
                    return { statusCode: 500, body: JSON.stringify({ error: "Codeformer returned unexpected format" }) };
                }
            } else if (typeof codeformerOutput === "string") {
                url = codeformerOutput;
            } else if (codeformerOutput && typeof codeformerOutput === "object" && (codeformerOutput as any).url) {
                url = (codeformerOutput as any).url;
            } else {
                return { statusCode: 500, body: JSON.stringify({ error: "Codeformer output is not an array" }) };
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
