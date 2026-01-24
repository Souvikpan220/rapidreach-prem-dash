import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { key } = req.body;
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(),"config","hotkeys.json"))
  );

  data.keys.includes(key)
    ? res.status(200).end()
    : res.status(401).end();
}
