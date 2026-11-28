// ═══════ GITHUB DATA BACKUP / RESTORE (user order 2026-11-28) ═══════
// Panel ka poora .data folder (users, servers, settings, server files)
// ek ZIP ki surat me private GitHub repo me auto-save hota hai:
//   - boot ke 20s baad, phir har 5 minute (sirf jab data badla ho)
//   - band hone (SIGTERM) par bhi
// Aur agar kisi naye host/VPS par .data khali mile, to boot par wahi ZIP
// wapas restore ho jata hai — panel har jagah same rehta hai.
// Config: project root me github-backup.json { token, owner, repo, file }
import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import { execFileSync } from "child_process";
import AdmZip from "adm-zip";
import axios from "axios";

interface GhCfg { token: string; owner: string; repo: string; file?: string }

function loadCfg(): GhCfg | null {
  try {
    const p = path.join(process.cwd(), "github-backup.json");
    if (!fs.existsSync(p)) return null;
    const c = JSON.parse(fs.readFileSync(p, "utf8"));
    if (!c || !c.token || !c.owner || !c.repo) return null;
    return c as GhCfg;
  } catch { return null; }
}

const zipName = (cfg: GhCfg) => cfg.file || "panel-data.zip";
const apiUrl = (cfg: GhCfg) => `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${zipName(cfg)}`;
const ghHeaders = (cfg: GhCfg) => ({
  Authorization: `Bearer ${cfg.token}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "syed-panel",
});

// ─── RESTORE (synchronous, server.ts me data-init se PEHLE chalta hai) ───
// Local data mojood ho (users.json me kam az kam 1 user) to KABHI overwrite nahi.
export function restoreFromGithubSync(): void {
  const cfg = loadCfg();
  if (!cfg) return;
  const dataDir = path.join(process.cwd(), ".data");
  try {
    const usersPath = path.join(dataDir, "users.json");
    if (fs.existsSync(usersPath)) {
      const u = JSON.parse(fs.readFileSync(usersPath, "utf8"));
      if (Array.isArray(u) && u.length > 0) return; // asal data hai — hath nahi lagana
    }
    const tmpZip = path.join(process.cwd(), ".panel-restore.zip");
    execFileSync("curl", ["-sfL", "--max-time", "180",
      "-H", `Authorization: Bearer ${cfg.token}`,
      "-H", "Accept: application/vnd.github.raw+json",
      "-H", "User-Agent: syed-panel",
      "-o", tmpZip, apiUrl(cfg)], { stdio: "pipe" });
    const head = fs.readFileSync(tmpZip).subarray(0, 2).toString("latin1");
    if (head !== "PK") throw new Error("bad restore file");
    const tmpDir = path.join(process.cwd(), ".data-restore-tmp");
    fs.removeSync(tmpDir);
    new AdmZip(tmpZip).extractAllTo(tmpDir, true);
    fs.ensureDirSync(dataDir);
    fs.copySync(tmpDir, dataDir, { overwrite: true });
    fs.removeSync(tmpDir);
    fs.removeSync(tmpZip);
    console.log("☁️ GitHub panel-data restore: .data wapas aa gaya");
  } catch (e: any) {
    console.log("☁️ GitHub panel-data restore skip:", e?.message || e);
    try { fs.removeSync(path.join(process.cwd(), ".panel-restore.zip")); } catch {}
    try { fs.removeSync(path.join(process.cwd(), ".data-restore-tmp")); } catch {}
  }
}

// ─── BACKUP ───
function addDir(zip: AdmZip, dir: string, base: string): void {
  let names: string[] = [];
  try { names = fs.readdirSync(dir); } catch { return; }
  for (const name of names) {
    if (name === "node_modules" || name === "temp") continue; // reinstallable / scratch — backup nahi
    const full = path.join(dir, name);
    const rel = base ? base + "/" + name : name;
    try {
      const st = fs.statSync(full);
      if (st.isDirectory()) addDir(zip, full, rel);
      else if (st.isFile() && st.size < 95 * 1024 * 1024) {
        const parent = path.dirname(rel);
        zip.addLocalFile(full, parent === "." ? "" : parent, name);
      }
    } catch { /* jo file na parhi jaye use chor do */ }
  }
}

let lastHash = "";
let busy = false;

export async function backupToGithub(reason: string): Promise<void> {
  const cfg = loadCfg();
  if (!cfg || busy) return;
  busy = true;
  try {
    const dataDir = path.join(process.cwd(), ".data");
    const zip = new AdmZip();
    addDir(zip, dataDir, "");
    let payload = zip.toBuffer();
    let note = "";
    if (payload.length > 45 * 1024 * 1024) {
      // GitHub ki had se pehle sirf JSON state (users/servers/settings) bhej do
      const jz = new AdmZip();
      for (const f of fs.readdirSync(dataDir)) {
        if (f.endsWith(".json")) jz.addLocalFile(path.join(dataDir, f), "", f);
      }
      payload = jz.toBuffer();
      note = " (JSON-only — poora data 45 MB se bara tha)";
    }
    const hash = crypto.createHash("sha256").update(payload).digest("hex");
    if (hash === lastHash) { busy = false; return; }
    let sha: string | undefined;
    try {
      const r = await axios.get(apiUrl(cfg), { headers: ghHeaders(cfg), timeout: 30000 });
      sha = (r.data as any)?.sha;
    } catch { /* file abhi repo me nahi — naya banega */ }
    await axios.put(apiUrl(cfg), {
      message: `Panel data backup (${reason}) ${new Date().toISOString()}`,
      content: payload.toString("base64"),
      sha,
    }, { headers: ghHeaders(cfg), timeout: 300000, maxContentLength: Infinity, maxBodyLength: Infinity });
    lastHash = hash;
    console.log(`☁️ GitHub panel-data backup ho gaya (${reason})${note} — ${(payload.length / 1024).toFixed(0)} KB`);
  } catch (e: any) {
    console.log("☁️ GitHub panel-data backup fail:", e?.response?.status || e?.message);
  }
  busy = false;
}

export function startGithubBackupLoop(): void {
  if (!loadCfg()) return;
  setTimeout(() => { backupToGithub("boot"); }, 20000);
  setInterval(() => { backupToGithub("auto"); }, 5 * 60 * 1000);
  process.on("SIGTERM", async () => {
    try { await backupToGithub("shutdown"); } catch {}
    process.exit(0);
  });
}
