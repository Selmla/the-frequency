import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storyPath = resolve(__dirname, "../src/story.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const file = await readFile(storyPath, "utf8");
      const story = JSON.parse(file);
      return res.status(200).json(story);
    } catch (error) {
      console.error("Failed to load story.json:", error);
      return res.status(500).json({ message: "Failed to load story data" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}