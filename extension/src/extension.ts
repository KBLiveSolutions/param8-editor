import { initialize, type ActivationContext } from "@ableton-extensions/sdk";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { execSync, spawn, type ChildProcess } from "node:child_process";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, basename } from "node:path";
import { WebSocketServer, WebSocket } from "ws";
import INJECTION from "./shim.html";
import { STATIC_FILES } from "./assets.js";

// ── Serial port state ─────────────────────────────────────────────────────────
// Shell processes are not subject to Node.js --experimental-permission restrictions.
let serialReader: ChildProcess | null = null;
let serialWriter: ChildProcess | null = null;
let serialPath = "";
const wsClients = new Set<WebSocket>();

function broadcast(msg: object) {
  const data = JSON.stringify(msg);
  for (const c of wsClients) {
    if (c.readyState === WebSocket.OPEN) c.send(data);
  }
}

function listPorts(): string[] {
  try {
    const raw = execSync("ls /dev/cu.usbmodem* 2>/dev/null || true").toString();
    return [...new Set(raw.trim().split("\n").filter(Boolean))];
  } catch { return []; }
}

function openSerial(portPath: string, baud: number): Promise<string | null> {
  return new Promise(resolve => {
    closeSerial();
    const cuPath = portPath.replace("/dev/tty.", "/dev/cu.");

    try {
      execSync(`stty -f "${cuPath}" ${baud} raw cs8 -parenb -cstopb clocal -crtscts min 1 time 0 2>&1`);
    } catch (e) {
      resolve(String(e));
      return;
    }

    // /bin/sh processes are not Node.js — they bypass the Node.js permission model entirely.
    const reader = spawn("/bin/sh", ["-c", `exec cat "${cuPath}"`], {
      stdio: ["ignore", "pipe", "ignore"],
    });
    const writer = spawn("/bin/sh", ["-c", `exec cat > "${cuPath}"`], {
      stdio: ["pipe", "ignore", "ignore"],
    });

    serialReader = reader;
    serialWriter = writer;
    serialPath = cuPath;

    reader.stdout!.on("data", (chunk: Buffer) => {
      broadcast({ type: "data", bytes: Array.from(chunk) });
    });

    console.log(`param8: opened ${cuPath}`);
    setTimeout(() => writeSerial([0xF0, 0x6F, 0x13, 0xF7]), 300);
    resolve(null);
  });
}

function closeSerial() {
  if (serialReader) { try { serialReader.kill(); } catch {} serialReader = null; }
  if (serialWriter) { try { serialWriter.kill(); } catch {} serialWriter = null; }
  serialPath = "";
}

function writeSerial(bytes: number[]): void {
  if (!serialWriter?.stdin) return;
  console.log("param8 TX:", bytes.map(b => b.toString(16).padStart(2, "0")).join(" "));
  try { serialWriter.stdin.write(Buffer.from(bytes)); }
  catch (e) { console.error("param8 writeSerial error:", e); }
}


// ── HTTP server ───────────────────────────────────────────────────────────────
function serveFile(req: IncomingMessage, res: ServerResponse) {
  const rawUrl = req.url ?? "/";
  const urlPath = (rawUrl === "/" ? "/index.html" : rawUrl).split("?")[0]!;
  const file = STATIC_FILES[urlPath];
  if (!file) { res.writeHead(404); res.end("Not found"); return; }

  if (urlPath === "/index.html") {
    const html = file.data.toString("utf-8").replace("<head>", `<head>\n${INJECTION}`);
    res.writeHead(200, { "Content-Type": file.mime });
    res.end(html);
  } else {
    res.writeHead(200, { "Content-Type": file.mime });
    res.end(file.data);
  }
}

const PRESETS_DIR = join(homedir(), "Documents", "param8-presets");

function listPresets(): string[] {
  try {
    mkdirSync(PRESETS_DIR, { recursive: true });
    const { readdirSync } = require("node:fs") as typeof import("node:fs");
    return readdirSync(PRESETS_DIR).filter((f: string) => f.endsWith(".json")).sort();
  } catch { return []; }
}

function handleApi(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/api/ports") {
    res.end(JSON.stringify({ ports: listPorts() }));
    return;
  }
  if (req.url === "/api/presets") {
    res.end(JSON.stringify({ presets: listPresets(), dir: PRESETS_DIR }));
    return;
  }
  res.writeHead(404);
  res.end("{}");
}

// ── WebSocket bridge ──────────────────────────────────────────────────────────
async function handleWsMessage(ws: WebSocket, raw: Buffer) {
  try {
    const msg = JSON.parse(raw.toString()) as {
      cmd: string; path?: string; baud?: number; bytes?: number[]; filename?: string; data?: string;
    };
    if (msg.cmd === "open") {
      const err = await openSerial(msg.path ?? "", msg.baud ?? 115200);
      ws.send(JSON.stringify(
        err ? { type: "openError", error: err }
            : { type: "opened", path: serialPath },
      ));
    } else if (msg.cmd === "close") {
      closeSerial();
    } else if (msg.cmd === "write" && msg.bytes) {
      writeSerial(msg.bytes);
    } else if (msg.cmd === "saveFile" && msg.filename && msg.data !== undefined) {
      try {
        mkdirSync(PRESETS_DIR, { recursive: true });
        let name = (msg.filename as string).replace(/[/\\:*?"<>|]/g, "_");
        if (!name.endsWith(".json")) name += ".json";
        writeFileSync(join(PRESETS_DIR, name), msg.data as string, "utf-8");
        ws.send(JSON.stringify({ type: "fileSaved", filename: name }));
      } catch (e) {
        ws.send(JSON.stringify({ type: "fileSaveError", error: String(e) }));
      }
    } else if (msg.cmd === "loadFile" && msg.filename) {
      try {
        const data = readFileSync(join(PRESETS_DIR, msg.filename as string), "utf-8");
        ws.send(JSON.stringify({ type: "fileLoaded", data, filename: msg.filename }));
      } catch (e) {
        ws.send(JSON.stringify({ type: "fileLoadError", error: String(e) }));
      }
    }
  } catch {}
}

// ── Entry point ───────────────────────────────────────────────────────────────
export function activate(activation: ActivationContext) {
  console.log("param8: activate() called");
  const context = initialize(activation, "1.0.0");

  const httpServer = createServer((req, res) => {
    req.url?.startsWith("/api/") ? handleApi(req, res) : serveFile(req, res);
  });

  const wss = new WebSocketServer({ noServer: true });
  httpServer.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket as never, head, (ws) => {
      wsClients.add(ws);
      ws.on("close", () => wsClients.delete(ws));
      ws.on("message", (raw) => handleWsMessage(ws, raw as Buffer));
    });
  });

  let serverPort = 0;
  httpServer.listen(0, "127.0.0.1", () => {
    const addr = httpServer.address();
    if (addr && typeof addr === "object") serverPort = addr.port;
  });

  context.commands.registerCommand("param8.openEditor", async () => {
    if (serverPort === 0) return;
    await context.ui.showModalDialog(`http://127.0.0.1:${serverPort}`, 980, 620);
  });

  const scopes = ["MidiTrack", "AudioTrack", "Scene", "ClipSlot"] as const;
  for (const scope of scopes) {
    context.ui.registerContextMenuAction(scope, "Open param8 Editor…", "param8.openEditor");
  }
  console.log("param8: ready, HTTP server starting...");
}
