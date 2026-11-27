const express = require("express");
const path = require("path");

const app = express();
const PORT = 3478;

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`param8 Editor running at http://localhost:${PORT}`);
});
