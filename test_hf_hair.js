import { client } from "@gradio/client";

async function run() {
    try {
        console.log("Connecting to DrBellswork/hairfastgan...");
        const app = await client("DrBellswork/hairfastgan");
        
        console.log("Fetching dummy images...");
        const res = await fetch("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png");
        const blob = await res.blob();
        
        console.log("Predicting...");
        const result = await app.predict("/swap_hair", [blob, blob, blob]);
        console.log("Success:", result);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
