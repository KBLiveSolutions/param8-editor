import { initialize, type ActivationContext } from "@ableton-extensions/sdk";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { Worker } from "node:worker_threads";
import { WebSocketServer, WebSocket } from "ws";
import INJECTION from "./shim.html";

// __dirname = extension/dist/ at runtime → ../../editor/public resolves to workspace root/editor/public
const EDITOR_DIR = path.join(__dirname, "../../editor/public");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg":  "image/svg+xml",
};

// ── Serial port state ─────────────────────────────────────────────────────────
let serialFd: number | null = null;
let serialWorker: Worker | null = null;
let serialPath = "";
const wsClients = new Set<WebSocket>();

// Worker script: polls fd with fs.readSync (O_NONBLOCK → catches EAGAIN and retries)
const WORKER_SCRIPT = `
const fs = require('node:fs');
const { workerData, parentPort } = require('node:worker_threads');
const fd = workerData.fd;
console.log('param8 worker: started fd=' + fd);
const buf = Buffer.alloc(1024);
function tick() {
  try {
    const n = fs.readSync(fd, buf, 0, buf.length, null);
    if (n > 0) {
      console.log('param8 RX: ' + Array.from(buf.slice(0,n)).map(b=>b.toString(16).padStart(2,'0')).join(' '));
      parentPort.postMessage(Array.from(buf.slice(0, n)));
      setImmediate(tick);
    } else { setTimeout(tick, 2); }
  } catch (e) {
    if (e.code === 'EAGAIN' || e.code === 'EWOULDBLOCK') { setTimeout(tick, 2); }
    else { console.error('param8 worker read error: ' + e.code); }
  }
}
tick();
`;

function broadcast(msg: object) {
  const data = JSON.stringify(msg);
  for (const c of wsClients) {
    if (c.readyState === WebSocket.OPEN) c.send(data);
  }
}

function listPorts(): string[] {
  try {
    // cu.* is preferred on macOS: no carrier-detect requirement
    const raw = execSync("ls /dev/cu.usbmodem* 2>/dev/null || true").toString();
    return [...new Set(raw.trim().split("\n").filter(Boolean))];
  } catch { return []; }
}

function openSerial(portPath: string, baud: number): string | null {
  try {
    closeSerial();
    const cuPath  = portPath.replace("/dev/tty.", "/dev/cu.");
    const ttyPath = portPath.replace("/dev/cu.", "/dev/tty.");
    // Use cu.* only: tty.* and cu.* are mutually exclusive on macOS USB CDC.
    // cu.* bypasses modem-control (no EAGAIN on writes), no DCD wait on open.
    execSync(`stty -f "${cuPath}" ${baud} raw cs8 -parenb -cstopb clocal -crtscts min 1 time 0 2>&1`);
    const fd = fs.openSync(cuPath, fs.constants.O_RDWR | fs.constants.O_NOCTTY | fs.constants.O_NONBLOCK);
    serialFd = fd;  // assign immediately so closeSerial() can clean up on error
    serialPath = cuPath;
    console.log(`param8: opened ${cuPath} fd=${fd}`);

    serialWorker = new Worker(WORKER_SCRIPT, { eval: true, workerData: { fd } });
    serialWorker.on("message", (bytes: number[]) => broadcast({ type: "data", bytes }));
    serialWorker.on("error", (err: Error) => console.error("param8 worker error:", err.message));
    serialWorker.on("exit", (code) => { if (code !== 0) console.error("param8 worker exited code:", code); });
    // Bootstrap: any SysEx sets serialEditorConnected=true on the firmware.
    setTimeout(() => writeSerial([0xF0, 0x6F, 0x13, 0xF7]), 150);
    return null;
  } catch (e) { closeSerial(); return String(e); }
}

function closeSerial() {
  if (serialWorker) { serialWorker.terminate(); serialWorker = null; }
  if (serialFd !== null) { try { fs.closeSync(serialFd); } catch {} serialFd = null; }
  serialPath = "";
}

function writeSerial(bytes: number[], attempt = 0): void {
  const fd = serialFd;
  if (fd === null) return;
  if (attempt === 0) console.log("param8 TX:", bytes.map(b => b.toString(16).padStart(2, "0")).join(" "));
  try { fs.writeSync(fd, Buffer.from(bytes)); }
  catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if ((err.code === "EAGAIN" || err.code === "EWOULDBLOCK") && attempt < 20) {
      setTimeout(() => writeSerial(bytes, attempt + 1), 10);
    } else {
      console.error(`param8 writeSerial error (attempt ${attempt}):`, err.message);
    }
  }
}


// ── HTTP server ───────────────────────────────────────────────────────────────
function serveFile(req: IncomingMessage, res: ServerResponse) {
  const rawUrl = req.url ?? "/";
  const urlPath = (rawUrl === "/" ? "/index.html" : rawUrl).split("?")[0]!;
  const filePath = path.join(EDITOR_DIR, urlPath);
  const ext = path.extname(urlPath);

  try {
    const raw = fs.readFileSync(filePath);
    const mime = MIME[ext] ?? "application/octet-stream";

    if (urlPath === "/index.html") {
      const html = raw.toString("utf-8").replace("<head>", `<head>\n${INJECTION}`);
      res.writeHead(200, { "Content-Type": mime });
      res.end(html);
    } else {
      res.writeHead(200, { "Content-Type": mime });
      res.end(raw);
    }
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

function handleApi(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/api/ports") {
    res.end(JSON.stringify({ ports: listPorts() }));
    return;
  }
  res.writeHead(404);
  res.end("{}");
}

// ── WebSocket bridge ──────────────────────────────────────────────────────────
function handleWsMessage(ws: WebSocket, raw: Buffer) {
  try {
    const msg = JSON.parse(raw.toString()) as {
      cmd: string; path?: string; baud?: number; bytes?: number[];
    };
    if (msg.cmd === "open") {
      const err = openSerial(msg.path ?? "", msg.baud ?? 115200);
      ws.send(JSON.stringify(
        err ? { type: "openError", error: err }
            : { type: "opened", path: serialPath },
      ));
    } else if (msg.cmd === "close") {
      closeSerial();
    } else if (msg.cmd === "write" && msg.bytes) {
      writeSerial(msg.bytes);
    }
  } catch {}
}

// ── Entry point ───────────────────────────────────────────────────────────────
export function activate(activation: ActivationContext) {
  console.log("param8: activate() called");
  const context = initialize(activation, "1.0.0");
  console.log("param8: initialized, registering commands...");

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
    await context.ui.showModalDialog(`http://127.0.0.1:${serverPort}`, 900, 620);
  });

  const scopes = ["MidiTrack", "AudioTrack", "Scene", "ClipSlot"] as const;
  for (const scope of scopes) {
    context.ui.registerContextMenuAction(scope, "Open param8 Editor…", "param8.openEditor");
  }
  console.log("param8: ready, HTTP server starting...");
}
