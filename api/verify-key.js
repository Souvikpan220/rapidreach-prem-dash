import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: "No key provided" });
    }

    const filePath = path.join(process.cwd(), "config", "hotkeys.json");
    const file = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(file);

    if (data.keys.includes(key.trim())) {
      return res.status(200).json({ success: true });
    }

    return res.status(401).json({ success: false });
  } catch (err) {
    console.error("VERIFY KEY ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
