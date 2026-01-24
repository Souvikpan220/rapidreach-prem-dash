import { HOTKEYS } from "../config/hotkeys.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: "No key provided" });
  }

  if (HOTKEYS.includes(key.trim())) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false });
}
