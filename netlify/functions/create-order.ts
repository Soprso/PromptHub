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

        // Dynamic Geolocation calculation
        const countryCode = event.headers['x-country'] || 'US';
        const baseUSD = 0.05;
        let currency = "USD";

        const countryToCurrency: Record<string, string> = {
            'IN': 'INR', 'GB': 'GBP', 'AU': 'AUD', 'CA': 'CAD', 'JP': 'JPY', 'CN': 'CNY'
        };

        const euroCountries = ['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'];
        if (euroCountries.includes(countryCode)) currency = 'EUR';
        else if (countryToCurrency[countryCode]) currency = countryToCurrency[countryCode];

        let rate = 1;
        try {
            const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            if (response.ok) {
                const data = await response.json();
                rate = data.rates[currency] || 1;
            }
        } catch (e) {
            console.error("Exchange fetch failed");
        }

        const amountInCurrency = baseUSD * rate;

        // Razorpay accepts integer sub-units (cents, paise, pence) for supported currencies.
        // E.g., USD: 100 cents = 1 USD. JPY: 1 unit = 1 JPY (no subunits usually, but razorpay accepts standard).
        let amount = Math.round(amountInCurrency * 100);
        if (currency === 'JPY') amount = Math.round(amountInCurrency); // JPY has no subunits in standard usage

        // Prevent absolute zero charges due to rounding
        if (amount <= 0 && currency !== 'JPY') amount = 1;

        const options = {
            amount,
            currency,
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
