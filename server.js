const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3478;

const REMOTE_SCRIPT_DIR =
  process.env.REMOTE_SCRIPT_DIR ||
  path.join(
    process.env.HOME,
    "Music/Ableton/User Library/Remote Scripts/param8"
  );

const MAPPINGS_PATH = path.join(REMOTE_SCRIPT_DIR, "mappings.json");
const DEFAULTS_PATH = path.join(REMOTE_SCRIPT_DIR, "defaults.json");

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/mappings", (req, res) => {
  try {
    const data = fs.readFileSync(MAPPINGS_PATH, "utf8");
    res.json(JSON.parse(data));
  } catch (e) {
    res.json({});
  }
});

app.put("/api/mappings", (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(MAPPINGS_PATH, JSON.stringify(data, null, 2), "utf8");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/defaults", (req, res) => {
  try {
    const data = fs.readFileSync(DEFAULTS_PATH, "utf8");
    res.json(JSON.parse(data));
  } catch (e) {
    res.json({});
  }
});

app.listen(PORT, () => {
  console.log(`param8 Editor running at http://localhost:${PORT}`);
  console.log(`Remote Script dir: ${REMOTE_SCRIPT_DIR}`);
  console.log(`Defaults: ${fs.existsSync(DEFAULTS_PATH) ? "found" : "NOT FOUND — open Ableton to generate"}`);
});
