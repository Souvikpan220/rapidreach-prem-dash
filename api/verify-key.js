import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { key } = req.body;

  const filePath = path.join(process.cwd(), "config", "hotkeys.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (data.keys.includes(key)) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false });
}
