import { JSDOM } from "jsdom";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const res = await req.json();
    const response = await fetch(
        `https://www.bing.com/images/search?q=${encodeURIComponent(res?.productName)}`
    );
    console.log(res?.productName);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const imageUrl = document.querySelector(".mimg")?.getAttribute("src");
    return new Response(`{"imageUrl": "${imageUrl}"}`, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
