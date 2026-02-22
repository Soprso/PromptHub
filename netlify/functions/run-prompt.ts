import OpenAI from "openai";

export const handler = async (event: any) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { prompt } = JSON.parse(event.body || "{}");

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Prompt is required" })
            };
        }

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            console.error("Missing OPENAI_API_KEY in environment variables");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Server configuration error: Missing API Key" })
            };
        }

        const client = new OpenAI({
            apiKey: OPENAI_API_KEY
        });

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                output: response.choices[0]?.message?.content || ""
            })
        };

    } catch (error: any) {
        console.error("OpenAI API error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ error: error?.message || "Failed to run prompt" })
        };
    }
};
