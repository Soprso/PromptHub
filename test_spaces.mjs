import { Client } from "@gradio/client";
async function testSpace() {
    console.log("Testing sczhou/CodeFormer...");
    try {
        const c = await Client.connect("sczhou/CodeFormer");
        console.log("SUCCESS!");
    } catch(e) { }
}
testSpace();
