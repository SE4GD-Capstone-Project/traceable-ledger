import fsPromises from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "json/data.json");

export const dynamic = "force-dynamic";

export async function GET() {
    const jsonData = await fsPromises.readFile(dataFilePath, "utf-8");
    return new Response(jsonData, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export async function POST(req: Request) {
    try {
        const res = await req.json();
        const newData = {
            companyName: res?.companyName,
            theme: res?.theme,
        };

        const updatedData = JSON.stringify(newData);
        await fsPromises.writeFile(dataFilePath, updatedData);
        return new Response("information updated successfully", {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                    "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        console.error(error);
        return new Response("Error storing data!", {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                    "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }
}
