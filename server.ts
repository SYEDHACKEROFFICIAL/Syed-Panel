import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import { createServer, request as httpRequest } from "http";
import { Server as SocketIOServer } from "socket.io";
import { createServer as createViteServer } from "vite";
import fs from "fs-extra";
import jwt from "jsonwebtoken";

const app = express();
const httpServer = createServer(app);
export const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" },
});
app.set("io", io);

// GitHub data backup/restore — data-init se PEHLE restore (naye host par .data khali ho to wapas ajaye)
import { restoreFromGithubSync, startGithubBackupLoop } from "./src/server/services/githubBackup.js";
restoreFromGithubSync();

// Initialize data folders
const DATA_DIR = path.join(process.cwd(), ".data");
const SERVERS_DIR = path.join(DATA_DIR, "servers");
const BACKUPS_DIR = path.join(process.cwd(), "backups");

fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(SERVERS_DIR);
fs.ensureDirSync(BACKUPS_DIR);
fs.ensureDirSync(path.join(DATA_DIR, "temp"));

if (!fs.existsSync(path.join(DATA_DIR, "users.json"))) fs.writeFileSync(path.join(DATA_DIR, "users.json"), "[]");
if (!fs.existsSync(path.join(DATA_DIR, "servers.json"))) fs.writeFileSync(path.join(DATA_DIR, "servers.json"), "[]");
if (!fs.existsSync(path.join(DATA_DIR, "settings.json"))) fs.writeFileSync(path.join(DATA_DIR, "settings.json"), "{}");

import { attachContainerSocket, getContainerLogs } from "./src/server/services/docker.js";
import { panelEvents } from "./src/server/events.js";
import { getLocalServerLogs } from "./src/server/services/local.js";

panelEvents.on("log", (serverId: string, logData: string) => {
  io.to(`server_${serverId}`).emit("log", logData);
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "syed-panel-super-secret");
    (socket as any).user = verified;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socket.on("joinServer", async (serverId) => {
    socket.join(`server_${serverId}`);
    
    // Stream initial logs whether local runtime or docker
    try {
      const serversJSON = await fs.readFile(path.join(DATA_DIR, "servers.json"), "utf8");
      const servers = JSON.parse(serversJSON);
      const server = Array.isArray(servers) ? servers.find((s: any) => s.id === serverId) : null;
      
      // Check local logs first
      const localLogs = await getLocalServerLogs(serverId);
      if (localLogs) {
        socket.emit("log", localLogs.trim() + "\n");
      }

      if (server && server.containerId && !String(server.containerId).startsWith("local-")) {
        const logs = await getContainerLogs(server.containerId);
        if (logs) {
           socket.emit("log", logs.trim() + "\n");
        }
        await attachContainerSocket(server.containerId, serverId);
      }
    } catch (e) {
      console.error("Error fetching logs for server", serverId, e);
    }
  });
  socket.on("leaveServer", (serverId) => {
    socket.leave(`server_${serverId}`);
  });
});

// STRICT ROUTING: 3000 for Admin/Dev, 6767 for Main/Prod
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (process.env.NODE_ENV === "development" ? 3000 : 6767);
const isDev = process.env.NODE_ENV === "development" && PORT === 3000;

app.use(express.json({ limit: "50gb" }));
app.use(express.urlencoded({ extended: true, limit: "50gb" }));
app.use(cors());

// ─── Website Hosting ─────────────────────────────────────────────────────────
// Servers of type WEBSITE (static) and PHP (dynamic) are reachable at
// https://<websiteSlug>.syedhacker.com. This middleware only acts on those
// hosts; the panel's own hosts (panel.*, www.*, apex, anything else) pass
// straight through to the normal panel/API handling below.
const SERVERS_FILE = path.join(DATA_DIR, "servers.json");
let websiteServersCache: { mtimeMs: number; servers: any[] } = { mtimeMs: 0, servers: [] };

const loadWebsiteServers = async (): Promise<any[]> => {
  try {
    const stat = await fs.stat(SERVERS_FILE);
    if (stat.mtimeMs !== websiteServersCache.mtimeMs) {
      const data = await fs.readJson(SERVERS_FILE).catch(() => []);
      websiteServersCache = { mtimeMs: stat.mtimeMs, servers: Array.isArray(data) ? data : [] };
    }
  } catch (e) {
    websiteServersCache = { mtimeMs: 0, servers: [] };
  }
  return websiteServersCache.servers;
};

const websiteBrandedPage = (title: string, message: string) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — SYED Panel</title>
<style>
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #0a0a0f; color: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .card { max-width: 560px; margin: 24px; padding: 40px; background: #12121c; border: 1px solid #26263a; border-radius: 16px; text-align: center; }
  h1 { margin: 0 0 12px; font-size: 28px; }
  p { color: #b9b9cc; line-height: 1.6; }
  .badge { display: inline-block; margin-top: 16px; padding: 6px 14px; border: 1px solid #26263a; border-radius: 999px; font-size: 13px; color: #b9b9cc; }
</style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <span class="badge">Powered by SYED Panel</span>
  </div>
</body>
</html>`;

const proxyToPhpServer = (req: express.Request, res: express.Response, server: any) => {
  const targetPort = server.port;
  const headers: Record<string, any> = { ...req.headers, host: `127.0.0.1:${targetPort}` };

  // If a body parser already consumed the request stream (form/JSON posts to
  // the panel pass through express.json/urlencoded first), re-serialize the
  // parsed body; otherwise stream the raw request through untouched.
  let bodyBuffer: Buffer | null = null;
  const bodyAlreadyParsed = (req as any)._body === true;
  if (bodyAlreadyParsed && req.body && ["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = String(req.headers["content-type"] || "");
    let serialized = "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      serialized = new URLSearchParams(req.body as Record<string, string>).toString();
    } else if (contentType.includes("application/json")) {
      serialized = JSON.stringify(req.body);
    }
    bodyBuffer = Buffer.from(serialized);
    headers["content-length"] = String(bodyBuffer.length);
  }

  const proxyReq = httpRequest({
    hostname: "127.0.0.1",
    port: targetPort,
    path: req.originalUrl || req.url,
    method: req.method,
    headers
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", () => {
    if (!res.headersSent) {
      res.status(502).type("html").send(websiteBrandedPage("Website Unavailable", "Website is starting or offline — SYED Panel"));
    } else {
      res.end();
    }
  });
  proxyReq.setTimeout(30000, () => proxyReq.destroy(new Error("PHP proxy timeout")));

  if (bodyAlreadyParsed) {
    proxyReq.end(bodyBuffer || Buffer.alloc(0));
  } else {
    req.pipe(proxyReq);
  }
};

app.use(async (req, res, next) => {
  const host = (req.headers.host || "").toLowerCase();
  const match = host.match(/^([a-z0-9][a-z0-9-]*)\.syedhacker\.com$/i);
  if (!match) return next();
  const slug = match[1].toLowerCase();
  if (slug === "panel" || slug === "www") return next();

  if (req.path.startsWith("/api")) {
    return res.status(404).type("text/plain").send("Not found");
  }

  try {
    const servers = await loadWebsiteServers();
    const server = servers.find((s: any) =>
      (s.websiteSlug || "").toLowerCase() === slug &&
      ["WEBSITE", "PHP"].includes((s.type || "").toUpperCase()) &&
      !s.suspended
    );
    if (!server) {
      return res.status(404).type("html").send(websiteBrandedPage("Site Not Found", "No website is hosted at this address. If you are the owner, check that your website is online in SYED Panel."));
    }

    if ((server.type || "").toUpperCase() === "PHP") {
      if (server.status !== "online") {
        return res.status(502).type("html").send(websiteBrandedPage("Website Unavailable", "Website is starting or offline — SYED Panel"));
      }
      return proxyToPhpServer(req, res, server);
    }

    // Static WEBSITE
    if (server.status !== "online") {
      return res.status(404).type("html").send(websiteBrandedPage("Site Not Found", "This website is currently offline. If you are the owner, start it from your SYED Panel."));
    }
    const root = path.join(SERVERS_DIR, server.id);
    return express.static(root, { index: "index.html", fallthrough: false, dotfiles: "deny" })(req, res, () => {
      if (!res.headersSent) {
        res.status(404).type("html").send(websiteBrandedPage("Page Not Found", "The requested page does not exist on this website."));
      }
    });
  } catch (e) {
    return next();
  }
});

import apiRoutes from "./src/server/routes/api.js";
app.use("/api", apiRoutes);

import { initSFTPServer } from "./src/server/services/sftp.js";

async function ensureOwnerFromEnv() {
  const envUser = process.env.SYED_OWNER_USER;
  const envPass = process.env.SYED_OWNER_PASS;
  if (!envUser || !envPass) return;

  try {
    const usersFile = path.join(DATA_DIR, "users.json");
    const users = (await fs.pathExists(usersFile)) ? await fs.readJson(usersFile) : [];
    const existingIndex = users.findIndex(
      (u: any) => u.username && u.username.toLowerCase() === envUser.toLowerCase()
    );
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.default.hash(envPass, 10);

    if (existingIndex !== -1) {
      users[existingIndex].password = hashedPassword;
      users[existingIndex].role = "owner";
      users[existingIndex].passwordVersion = (users[existingIndex].passwordVersion || 0) + 1;
    } else {
      users.forEach((u: any) => {
        if (u.role === "owner") u.role = "admin";
      });
      users.push({
        id: "owner-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        username: envUser,
        password: hashedPassword,
        role: "owner",
        passwordVersion: 0,
        createdAt: new Date().toISOString(),
      });
    }
    await fs.writeJson(usersFile, users, { spaces: 2 });
    console.log(`[SYED] Owner user '${envUser}' ensured in database.`);
  } catch (err) {
    console.error("[SYED] Failed to ensure owner from environment:", err);
  }
}

async function startServer() {
  await ensureOwnerFromEnv();
  await initSFTPServer();

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`SYED Panel running on port ${PORT}`);
    startGithubBackupLoop();
  });
}

startServer();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  fs.writeFileSync('crash.log', String(err.stack));
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  fs.writeFileSync('crash.log', String(reason));
});
