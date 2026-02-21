import Razorpay from "razorpay";

export const handler = async (event: any) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
        const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

        console.log("-- Environment Check (create-order) --");
        console.log("Razorpay Key ID exists:", !!RAZORPAY_KEY_ID);
        console.log("Razorpay Secret exists:", !!RAZORPAY_SECRET);

        if (!RAZORPAY_KEY_ID) {
            console.error("Missing RAZORPAY_KEY_ID in Netlify environment");
            return { statusCode: 500, body: JSON.stringify({ error: "Server config error: Missing RAZORPAY_KEY_ID" }) };
        }

        if (!RAZORPAY_SECRET) {
            console.error("Missing RAZORPAY_SECRET in Netlify environment");
            return { statusCode: 500, body: JSON.stringify({ error: "Server config error: Missing RAZORPAY_SECRET" }) };
        }

        const razorpay = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_SECRET,
        });

        // STRICT SERVER-CONTROLLED AMOUNT
        // 50 INR = 5000 paise
        const amount = 5000;

        const options = {
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        // We return the amount alongside the order ID to populate the checkout UI securely
        return {
            statusCode: 200,
            body: JSON.stringify({
                key_id: RAZORPAY_KEY_ID, // Frontend needs this to open the checkout modal securely
                order_id: order.id,
                amount: order.amount,
                currency: order.currency
            })
        };

    } catch (error: any) {
        console.error("Razorpay order creation error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error?.message || "Failed to create payment order" })
        };
    }
};
