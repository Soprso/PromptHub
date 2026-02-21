import Razorpay from "razorpay";

export const handler = async (event: any) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
        const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

        if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
            console.error("Missing Razorpay Keys");
            return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error." }) };
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
