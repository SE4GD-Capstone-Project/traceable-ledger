import fsPromises from "fs/promises";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

const dataFilePath = path.join(process.cwd(), "json/data.json");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const jsonData = await fsPromises.readFile(dataFilePath, "utf-8");
        const objectData = JSON.parse(jsonData);
        res.status(200).json(objectData);
    }

    if (req.method === "POST") {
        try {
            const { companyName, theme } = req.body;
            const newData = {
                companyName: companyName,
                theme: theme,
            };

            const updatedData = JSON.stringify(newData);
            await fsPromises.writeFile(dataFilePath, updatedData).then(() => {
                console.log("called");
            });
            console.log(updatedData);
            res.status(200).json({
                message: "information updated successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error storing data!" });
        }
    }
}
