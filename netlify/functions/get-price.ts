export const handler = async (event: any) => {
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Netlify injects x-country header in production, default to 'US' locally
        const countryCode = event.headers['x-country'] || 'US';

        const baseUSD = 0.05;
        let currency = "USD";
        let symbol = "$";

        const countryToCurrency: Record<string, { code: string, sym: string }> = {
            'IN': { code: 'INR', sym: '₹' },
            'GB': { code: 'GBP', sym: '£' },
            'AU': { code: 'AUD', sym: 'A$' },
            'CA': { code: 'CAD', sym: 'C$' },
            'JP': { code: 'JPY', sym: '¥' },
            'CN': { code: 'CNY', sym: '¥' },
            'US': { code: 'USD', sym: '$' }
        };

        const euroCountries = ['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'];

        if (euroCountries.includes(countryCode)) {
            currency = 'EUR';
            symbol = '€';
        } else if (countryToCurrency[countryCode]) {
            currency = countryToCurrency[countryCode].code;
            symbol = countryToCurrency[countryCode].sym;
        }

        let rate = 1;
        try {
            const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            if (response.ok) {
                const data = await response.json();
                rate = data.rates[currency] || 1;
            }
        } catch (e) {
            console.error("Exchange rate fetch failed, using fallback rate 1");
        }

        const amountInCurrency = baseUSD * rate;

        // Some currencies don't use decimals (like JPY), but most do.
        // For simplicity, .toFixed(2) works for most display purposes natively.
        let displayAmount = amountInCurrency.toFixed(2);

        // Formatting specific quirks
        if (currency === 'JPY') displayAmount = Math.round(amountInCurrency).toString();

        return {
            statusCode: 200,
            body: JSON.stringify({
                country: countryCode,
                currency: currency,
                symbol: symbol,
                displayAmount: displayAmount,
                originalUSD: baseUSD
            })
        };

    } catch (error: any) {
        console.error("Pricing error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to load pricing" })
        };
    }
};
