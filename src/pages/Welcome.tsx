import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  LogIn,
  UserPlus,
  Zap,
  Gauge,
  Clock,
  X,
  Send,
  MessageCircle,
  Youtube,
  ArrowRight,
  Server,
  ShieldCheck,
  Terminal,
  FolderCog,
  RefreshCw,
  Layers,
  Cpu,
  Globe,
  Gamepad2,
  Code2,
  Coffee,
  Network,
  Boxes,
  Braces,
  Sparkles,
  CheckCircle2,
  Cloud,
  LifeBuoy,
  Timer,
  Database,
  Play,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const POPUP_FLAG = "syed_join_popup_seen";

const channels = [
  {
    name: "Telegram Channel",
    label: "Join on Telegram",
    href: "https://t.me/syedinc",
    icon: Send,
    classes:
      "bg-[#229ED9]/15 border-[#229ED9]/40 text-[#7cc7ec] hover:bg-[#229ED9]/25",
  },
  {
    name: "WhatsApp Channel",
    label: "Join on WhatsApp",
    href: "https://whatsapp.com/channel/0029VaGiJKfIiRoybPBMTy38",
    icon: MessageCircle,
    classes:
      "bg-[#25D366]/10 border-[#25D366]/40 text-[#7ce6a3] hover:bg-[#25D366]/20",
  },
  {
    name: "YouTube Channel",
    label: "Subscribe on YouTube",
    href: "https://www.youtube.com/@Teamsyedhaker",
    icon: Youtube,
    classes:
      "bg-[#FF0000]/10 border-[#FF0000]/40 text-[#ff9c9c] hover:bg-[#FF0000]/20",
  },
];

const stats = [
  { icon: Gauge, value: "99.9%", label: "Uptime Guarantee" },
  { icon: Server, value: "8", label: "Server Types" },
  { icon: Timer, value: "< 60s", label: "Instant Setup" },
  { icon: Clock, value: "24/7", label: "Always Online" },
];

const features = [
  {
    icon: Zap,
    title: "Instant Deployment",
    text: "Pick a type, name your server and hit create. Your server is installed and ready to start in under a minute — no manual setup, no waiting.",
  },
  {
    icon: Terminal,
    title: "Live Console & Stats",
    text: "Watch your server boot in real time, send commands from your browser and monitor CPU, RAM and network with live performance graphs.",
  },
  {
    icon: FolderCog,
    title: "Full File Manager",
    text: "Upload plugins, edit configs and manage every file from a built-in editor with syntax highlighting — no FTP client needed.",
  },
  {
    icon: RefreshCw,
    title: "One-Click Version Switcher",
    text: "Jump between Minecraft versions or runtimes in a couple of clicks. Reinstall or switch software without losing your panel setup.",
  },
  {
    icon: ShieldCheck,
    title: "Protected Infrastructure",
    text: "Servers run on hardened nodes with DDoS protection and isolated environments, so your world and your data stay safe around the clock.",
  },
  {
    icon: Cloud,
    title: "Backups & Restore",
    text: "Create backups of your entire server and restore them whenever you need. Experiment freely — rolling back takes seconds.",
  },
  {
    icon: Cpu,
    title: "High-Performance Hardware",
    text: "Fast modern CPUs and NVMe SSD storage keep tick rates smooth and loading times low, even with heavy modpacks and big worlds.",
  },
  {
    icon: LifeBuoy,
    title: "Community Support",
    text: "Stuck on a config or a plugin? Our Telegram, WhatsApp and YouTube community is active every day with guides, updates and help.",
  },
];

const serverTypes = [
  {
    icon: Coffee,
    name: "Paper",
    tag: "Minecraft",
    text: "The high-performance Minecraft server fork. Best choice for survival, SMP and minigame servers that need speed and plugin support.",
  },
  {
    icon: Gamepad2,
    name: "Spigot",
    tag: "Minecraft",
    text: "The classic plugin-powered server software. Thousands of plugins, proven stability and the setup most communities start with.",
  },
  {
    icon: Boxes,
    name: "Fabric",
    tag: "Minecraft Mods",
    text: "Lightweight and fast modding platform. Run modern Fabric mods and performance mods with quick version updates.",
  },
  {
    icon: Layers,
    name: "Forge",
    tag: "Minecraft Mods",
    text: "The home of big modpacks. Host huge Forge modpacks with hundreds of mods for you and your friends.",
  },
  {
    icon: Network,
    name: "BungeeCord",
    tag: "Proxy",
    text: "Link multiple Minecraft servers into one network. One lobby, many gamemodes — players move between servers seamlessly.",
  },
  {
    icon: Globe,
    name: "Velocity",
    tag: "Proxy",
    text: "The modern, high-performance proxy from the Paper team. Faster, more secure forwarding for serious Minecraft networks.",
  },
  {
    icon: Braces,
    name: "Node.js",
    tag: "Apps & Bots",
    text: "Deploy Discord bots, web apps and APIs on Node.js with a panel that handles restarts, logs and environment variables for you.",
  },
  {
    icon: Code2,
    name: "Python",
    tag: "Apps & Bots",
    text: "Run Python bots, scripts and web services. Install your requirements and launch — perfect for automation and small apps.",
  },
];

const steps = [
  {
    icon: UserPlus,
    step: "Step 1",
    title: "Create Your Account",
    text: "Register in seconds with just a username and password. No complicated forms — your dashboard is ready the moment you sign up.",
  },
  {
    icon: Server,
    step: "Step 2",
    title: "Create Your Server",
    text: "Choose from 8 server types — Paper, Fabric, Node.js, Python and more — set your RAM and port, and let the panel build it instantly.",
  },
  {
    icon: Play,
    step: "Step 3",
    title: "Play or Deploy",
    text: "Hit start, watch the console come alive and share your server address with friends — or push your app live for the world.",
  },
];

const whyPoints = [
  "No credit card or complicated setup — register and deploy",
  "Every server type you need in one panel: Minecraft, proxies, Node.js and Python",
  "Real-time console, file manager and backups built right in",
  "Performance-tuned nodes with NVMe storage and DDoS protection",
  "An active community on Telegram, WhatsApp and YouTube for help and updates",
];

const faqs = [
  {
    q: "Is it really free to start?",
    a: "Yes. Create an account and spin up your first server right away. The panel is built for the community — register, pick a server type and you are online in under a minute.",
  },
  {
    q: "Which server types can I run?",
    a: "Eight types are ready out of the box: Paper, Spigot, Fabric and Forge for Minecraft, BungeeCord and Velocity proxies for networks, plus Node.js and Python for bots, apps and APIs.",
  },
  {
    q: "Can I switch my Minecraft version later?",
    a: "Absolutely. The built-in version switcher lets you change versions or reinstall your server software in a few clicks, whenever you want to try something new.",
  },
  {
    q: "How do I manage my server files and plugins?",
    a: "Everything happens in the browser: a full file manager with an editor for configs, plugin uploads, a live console for commands and one-click backups and restores.",
  },
  {
    q: "Where do I get help if I am stuck?",
    a: "Join our community channels — Telegram, WhatsApp and YouTube — for announcements, tutorials, giveaways and support from the team and other server owners.",
  },
];

const marqueeItems = [
  "Paper",
  "Spigot",
  "Fabric",
  "Forge",
  "BungeeCord",
  "Velocity",
  "Node.js",
  "Python",
  "Instant Setup",
  "24/7 Online",
  "DDoS Protection",
  "Live Console",
];

const PAGE_CSS = `
  .wlc-perspective { perspective: 1400px; }
  .wlc-preserve3d { transform-style: preserve-3d; }

  @keyframes wlc-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-16px); }
  }
  @keyframes wlc-float-soft {
    0%, 100% { transform: translateY(0px) rotate(-1deg); }
    50% { transform: translateY(-9px) rotate(1.5deg); }
  }
  @keyframes wlc-spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes wlc-cube-spin {
    from { transform: rotateX(-22deg) rotateY(0deg); }
    to { transform: rotateX(-22deg) rotateY(360deg); }
  }
  @keyframes wlc-ring-spin {
    from { transform: rotateX(72deg) rotateZ(0deg); }
    to { transform: rotateX(72deg) rotateZ(360deg); }
  }
  @keyframes wlc-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes wlc-orb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(40px, -30px) scale(1.12); }
    66% { transform: translate(-30px, 20px) scale(0.94); }
  }
  @keyframes wlc-fade-up {
    from { opacity: 0; transform: translateY(26px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes wlc-pulse-glow {
    0%, 100% { opacity: 0.55; transform: scale(1); }
    50% { opacity: 0.95; transform: scale(1.08); }
  }
  @keyframes wlc-tilt-sway {
    0%, 100% { transform: perspective(1100px) rotateX(7deg) rotateY(-9deg); }
    50% { transform: perspective(1100px) rotateX(3deg) rotateY(7deg); }
  }
  @keyframes wlc-bar {
    0% { width: 18%; }
    50% { width: 82%; }
    100% { width: 46%; }
  }
  @keyframes wlc-gradient-pan {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .wlc-hero-in { opacity: 0; animation: wlc-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .wlc-float { animation: wlc-float 6s ease-in-out infinite; }
  .wlc-float-soft { animation: wlc-float-soft 7s ease-in-out infinite; }
  .wlc-orb { animation: wlc-orb 16s ease-in-out infinite; }
  .wlc-gradient-text {
    background-size: 200% auto;
    animation: wlc-gradient-pan 6s ease infinite;
  }

  .wlc-cube { animation: wlc-cube-spin 22s linear infinite; transform-style: preserve-3d; }
  .wlc-cube-face {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; letter-spacing: 0.08em; font-size: 13px;
    border: 1px solid rgba(var(--theme-rgb-500), 0.45);
    background: linear-gradient(145deg, rgba(var(--theme-rgb-600), 0.28), rgba(255,255,255,0.04));
    backdrop-filter: blur(2px);
    border-radius: 14px;
    color: #fff;
    text-shadow: 0 2px 12px rgba(0,0,0,0.6);
  }

  .wlc-ring {
    position: absolute; border-radius: 9999px;
    border: 1px dashed rgba(var(--theme-rgb-500), 0.4);
    animation: wlc-ring-spin 26s linear infinite;
    transform-style: preserve-3d;
  }

  .wlc-tilt {
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease, border-color 0.3s ease;
    transform: perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0);
    will-change: transform;
  }
  .wlc-tilt:hover {
    transform: perspective(1100px) rotateX(6deg) rotateY(-6deg) translateY(-8px);
    box-shadow: 0 24px 50px -18px rgba(var(--theme-rgb-600), 0.45);
    border-color: rgba(var(--theme-rgb-500), 0.5);
  }
  .wlc-sway { animation: wlc-tilt-sway 11s ease-in-out infinite; }

  .wlc-marquee-track {
    display: flex; width: max-content;
    animation: wlc-marquee 30s linear infinite;
  }
  .wlc-marquee-track:hover { animation-play-state: paused; }

  .reveal {
    opacity: 0;
    transform: translateY(34px);
    transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reveal.is-visible { opacity: 1; transform: translateY(0); }

  @media (prefers-reduced-motion: reduce) {
    .wlc-float, .wlc-float-soft, .wlc-orb, .wlc-cube, .wlc-ring,
    .wlc-marquee-track, .wlc-sway, .wlc-gradient-text, .wlc-hero-in {
      animation: none !important;
    }
    .wlc-hero-in { opacity: 1; }
    .reveal { opacity: 1; transform: none; transition: none; }
    .wlc-tilt { transition: none; }
    .wlc-tilt:hover { transform: none; }
  }
`;

function CubeFace({
  transform,
  label,
}: {
  transform: string;
  label: string;
}) {
  return (
    <div className="wlc-cube-face" style={{ transform }}>
      {label}
    </div>
  );
}

export default function Welcome() {
  const { panelName } = useSettings();
  const name = panelName || "SYED Panel";
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    try {
      if (!sessionStorage.getItem(POPUP_FLAG)) {
        timer = window.setTimeout(() => setShowPopup(true), 800);
      }
    } catch {
      timer = window.setTimeout(() => setShowPopup(true), 800);
    }
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
    try {
      sessionStorage.setItem(POPUP_FLAG, "1");
    } catch {
      /* sessionStorage unavailable */
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#050510] text-foreground relative overflow-hidden">
      <style>{PAGE_CSS}</style>

      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="wlc-orb absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[480px] bg-theme-600/12 blur-[130px] rounded-full" />
        <div
          className="wlc-orb absolute top-[38%] -left-40 w-96 h-96 bg-theme-800/12 blur-[110px] rounded-full"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="wlc-orb absolute bottom-[-10%] right-[-8%] w-[28rem] h-[28rem] bg-theme-600/10 blur-[120px] rounded-full"
          style={{ animationDelay: "-11s" }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-20 max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 pt-5">
        <div className="flex items-center gap-3">
          <img
            src="/syed-king.png"
            alt={name}
            className="w-10 h-10 object-cover rounded-xl border border-theme-600/40 shadow-[0_0_24px_-6px_rgba(var(--theme-rgb-600),0.7)]"
          />
          <span className="font-extrabold tracking-tight text-lg">{name}</span>
        </div>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 text-sm font-semibold transition-colors"
          >
            <LogIn className="w-4 h-4" />
            LOGIN
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-theme-600 hover:bg-theme-500 text-white text-sm font-semibold shadow-[0_4px_24px_-4px_rgba(var(--theme-rgb-600),0.6)] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            REGISTER
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 grid lg:grid-cols-2 gap-14 items-center">
        <div className="text-center lg:text-left">
          <div
            className="wlc-hero-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-theme-600/40 bg-theme-600/10 text-theme-300 text-xs sm:text-sm font-semibold"
            style={{ animationDelay: "0.05s" }}
          >
            <Sparkles className="w-4 h-4" />
            Free Game &amp; App Server Hosting
          </div>

          <h1
            className="wlc-hero-in mt-6 text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05]"
            style={{ animationDelay: "0.15s" }}
          >
            {name}
            <span className="block mt-3 text-3xl sm:text-4xl xl:text-5xl font-extrabold wlc-gradient-text bg-gradient-to-r from-theme-400 via-theme-500 to-theme-300 bg-clip-text text-transparent">
              Your Server. Your Rules.
            </span>
          </h1>

          <p
            className="wlc-hero-in mt-6 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-foreground/70 leading-relaxed"
            style={{ animationDelay: "0.28s" }}
          >
            Launch a Minecraft server, a proxy network, a Discord bot or a full
            web app in under a minute. {name} gives you a powerful control
            panel with a live console, full file manager and one-click installs
            — everything you need, right in your browser.
          </p>

          <div
            className="wlc-hero-in mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-theme-600 hover:bg-theme-500 text-white font-semibold shadow-[0_4px_24px_-4px_rgba(var(--theme-rgb-600),0.6)] transition-all hover:-translate-y-0.5"
            >
              <Rocket className="w-5 h-5" />
              GET STARTED
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 font-semibold transition-colors"
            >
              <LogIn className="w-5 h-5" />
              LOGIN
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/5 border border-theme-600/40 text-theme-300 hover:bg-theme-600/15 font-semibold transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              REGISTER
            </Link>
          </div>

          <div
            className="wlc-hero-in mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-foreground/60"
            style={{ animationDelay: "0.52s" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-theme-400" /> No credit card
              needed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-theme-400" /> Setup in under
              a minute
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-theme-400" /> 8 server types
              included
            </span>
          </div>
        </div>

        {/* Hero 3D scene */}
        <div className="wlc-hero-in relative mx-auto w-full max-w-[520px] h-[420px] sm:h-[480px] wlc-perspective" style={{ animationDelay: "0.3s" }}>
          {/* glow */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-theme-600/25 blur-[80px]"
            style={{ animation: "wlc-pulse-glow 5s ease-in-out infinite" }}
          />
          {/* orbit rings */}
          <div className="wlc-ring w-[380px] h-[380px] left-1/2 top-1/2 -ml-[190px] -mt-[190px] hidden sm:block" />
          <div
            className="wlc-ring w-[280px] h-[280px] left-1/2 top-1/2 -ml-[140px] -mt-[140px]"
            style={{ animationDuration: "18s", animationDirection: "reverse" }}
          />

          {/* levitating hero image */}
          <div className="absolute left-1/2 top-[16%] -translate-x-1/2 z-20">
            <div className="wlc-float">
              <img
                src="/syed-king.png"
                alt={name}
                className="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-[2rem] border border-theme-500/40 shadow-[0_30px_70px_-15px_rgba(var(--theme-rgb-600),0.65)]"
              />
            </div>
          </div>

          {/* spinning 3D cube */}
          <div className="absolute right-2 sm:right-6 top-2 wlc-preserve3d hidden sm:block">
            <div className="wlc-cube relative w-[104px] h-[104px]">
              <CubeFace transform="translateZ(52px)" label="PAPER" />
              <CubeFace transform="rotateY(180deg) translateZ(52px)" label="NODE" />
              <CubeFace transform="rotateY(90deg) translateZ(52px)" label="PYTHON" />
              <CubeFace transform="rotateY(-90deg) translateZ(52px)" label="FABRIC" />
              <CubeFace transform="rotateX(90deg) translateZ(52px)" label="FORGE" />
              <CubeFace transform="rotateX(-90deg) translateZ(52px)" label="VELOCITY" />
            </div>
          </div>

          {/* floating glass console card */}
          <div className="absolute left-0 sm:left-2 bottom-6 z-20 w-[240px] sm:w-[264px]">
            <div className="wlc-sway rounded-2xl border border-white/12 bg-white/[0.05] backdrop-blur-md p-4 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/80">
                  <Terminal className="w-4 h-4 text-theme-400" /> Live Console
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <div className="mt-3 font-mono text-[11px] leading-relaxed text-foreground/55">
                <div>&gt; Starting Paper server...</div>
                <div>&gt; Done (3.214s)! Ready to play.</div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-foreground/55 mb-1">
                  <span>CPU</span>
                  <span>Live</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-theme-500 to-theme-300"
                    style={{ animation: "wlc-bar 5s ease-in-out infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* floating chips */}
          <div className="absolute right-0 sm:right-4 bottom-24 z-20">
            <div
              className="wlc-float-soft inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-theme-600/40 bg-[#0a0a1a]/85 backdrop-blur text-sm font-semibold shadow-lg"
              style={{ animationDelay: "-2s" }}
            >
              <Database className="w-4 h-4 text-theme-400" /> NVMe Storage
            </div>
          </div>
          <div className="absolute left-2 sm:left-8 top-4 z-20">
            <div
              className="wlc-float-soft inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/12 bg-[#0a0a1a]/85 backdrop-blur text-sm font-semibold shadow-lg"
              style={{ animationDelay: "-4.5s" }}
            >
              <ShieldCheck className="w-4 h-4 text-theme-400" /> DDoS Protected
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="relative z-10 border-y border-white/8 bg-white/[0.02] py-4 overflow-hidden">
        <div className="wlc-marquee-track">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex items-center gap-10 pr-10"
              aria-hidden={dup === 1}
            >
              {marqueeItems.map((item) => (
                <span
                  key={`${dup}-${item}`}
                  className="inline-flex items-center gap-10 whitespace-nowrap text-sm font-bold tracking-[0.18em] text-foreground/50"
                >
                  {item}
                  <Sparkles className="w-4 h-4 text-theme-500/70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="reveal wlc-tilt rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-7 text-center"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <s.icon className="w-7 h-7 mx-auto text-theme-400" />
              <div className="mt-3 text-3xl sm:text-4xl font-extrabold">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-foreground/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="reveal text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Everything You Need to{" "}
            <span className="wlc-gradient-text bg-gradient-to-r from-theme-400 to-theme-300 bg-clip-text text-transparent">
              Run Your Server
            </span>
          </h2>
          <p className="mt-4 text-foreground/65 sm:text-lg">
            A complete control panel built for gamers and developers — powerful
            where it matters, simple everywhere else.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="reveal wlc-tilt rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              style={{ transitionDelay: `${(i % 4) * 70}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-theme-600/15 border border-theme-600/30 flex items-center justify-center">
                <f.icon className="w-6 h-6 text-theme-400" />
              </div>
              <h3 className="mt-4 font-bold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Server types */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="reveal text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            8 Server Types,{" "}
            <span className="wlc-gradient-text bg-gradient-to-r from-theme-400 to-theme-300 bg-clip-text text-transparent">
              One Panel
            </span>
          </h2>
          <p className="mt-4 text-foreground/65 sm:text-lg">
            Minecraft servers, modded worlds, network proxies, bots and apps —
            whatever you want to host, there is a type ready for it.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {serverTypes.map((t, i) => (
            <div
              key={t.name}
              className="reveal wlc-tilt group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6"
              style={{ transitionDelay: `${(i % 4) * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-theme-600/15 border border-theme-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <t.icon className="w-6 h-6 text-theme-400" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-theme-600/40 bg-theme-600/10 text-theme-300">
                  {t.tag}
                </span>
              </div>
              <h3 className="mt-4 font-bold text-xl">{t.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                {t.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="reveal text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Online in{" "}
            <span className="wlc-gradient-text bg-gradient-to-r from-theme-400 to-theme-300 bg-clip-text text-transparent">
              Three Simple Steps
            </span>
          </h2>
          <p className="mt-4 text-foreground/65 sm:text-lg">
            From sign-up to a running server in about a minute. Here is how it
            works.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5 relative">
          <div className="hidden md:block absolute top-16 left-[18%] right-[18%] border-t-2 border-dashed border-theme-600/30" />
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="reveal wlc-tilt relative rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="relative z-10 w-14 h-14 mx-auto rounded-2xl bg-theme-600 border border-theme-400/50 flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(var(--theme-rgb-600),0.7)]">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <div className="mt-4 text-xs font-bold tracking-[0.2em] uppercase text-theme-400">
                {s.step}
              </div>
              <h3 className="mt-2 font-bold text-xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal wlc-perspective order-2 lg:order-1">
          <div className="wlc-sway relative mx-auto max-w-md">
            <div className="rounded-3xl border border-white/12 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-7 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.85)]">
              <div className="flex items-center gap-3">
                <img
                  src="/syed-king.png"
                  alt={name}
                  className="w-12 h-12 object-cover rounded-xl border border-theme-600/40"
                />
                <div>
                  <div className="font-bold">{name} Dashboard</div>
                  <div className="text-xs text-foreground/55">
                    One panel for every server you own
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { icon: Terminal, label: "Live Console" },
                  { icon: FolderCog, label: "File Manager & Editor" },
                  { icon: Cloud, label: "Backups & Restore" },
                  { icon: RefreshCw, label: "Version Switcher" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <span className="inline-flex items-center gap-2.5 text-sm font-semibold">
                      <row.icon className="w-4.5 h-4.5 text-theme-400" />
                      {row.label}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -right-3 sm:-right-6">
              <div
                className="wlc-float-soft rounded-2xl border border-theme-600/40 bg-[#0a0a1a]/90 backdrop-blur px-4 py-3 shadow-xl"
                style={{ animationDelay: "-3s" }}
              >
                <div className="text-[11px] text-foreground/55 font-semibold">
                  SERVER STATUS
                </div>
                <div className="inline-flex items-center gap-1.5 font-bold text-emerald-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online — 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="reveal order-1 lg:order-2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Why Server Owners{" "}
            <span className="wlc-gradient-text bg-gradient-to-r from-theme-400 to-theme-300 bg-clip-text text-transparent">
              Choose {name}
            </span>
          </h2>
          <p className="mt-4 text-foreground/65 sm:text-lg leading-relaxed">
            We built the panel we always wanted to use: fast to start, honest
            about performance and packed with the tools you actually need —
            without the enterprise price tag or the confusing setup.
          </p>
          <ul className="mt-7 space-y-3.5 text-left">
            {whyPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-theme-600/15 border border-theme-600/40 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-theme-400" />
                </span>
                <span className="text-foreground/75 leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-theme-600 hover:bg-theme-500 text-white font-semibold shadow-[0_4px_24px_-4px_rgba(var(--theme-rgb-600),0.6)] transition-all hover:-translate-y-0.5"
            >
              <Rocket className="w-5 h-5" />
              Start Hosting Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="reveal text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Frequently Asked{" "}
            <span className="wlc-gradient-text bg-gradient-to-r from-theme-400 to-theme-300 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mt-4 text-foreground/65 sm:text-lg">
            Everything you need to know before you launch your first server.
          </p>
        </div>
        <div className="mt-10 space-y-3.5">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              className="reveal group rounded-2xl border border-white/10 bg-white/[0.03] open:border-theme-600/40 open:bg-theme-600/[0.05] transition-colors"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="shrink-0 w-7 h-7 rounded-full bg-theme-600/15 border border-theme-600/30 flex items-center justify-center text-theme-300 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-6 pb-6 text-sm sm:text-base leading-relaxed text-foreground/65">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="reveal wlc-perspective">
          <div className="wlc-tilt relative overflow-hidden rounded-[2rem] border border-theme-600/40 bg-gradient-to-br from-theme-600/25 via-[#0a0a1a] to-[#0a0a1a] px-6 py-12 sm:p-14 text-center">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[280px] bg-theme-600/25 blur-[90px] rounded-full" />
            <img
              src="/syed-king.png"
              alt={name}
              className="relative w-20 h-20 object-cover rounded-3xl border border-theme-500/40 mx-auto shadow-[0_0_50px_-10px_rgba(var(--theme-rgb-600),0.6)]"
            />
            <h2 className="relative mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Launch Your Server?
            </h2>
            <p className="relative mt-4 max-w-xl mx-auto text-foreground/70 sm:text-lg">
              Join {name} today and have your game server, proxy network or app
              online in under a minute. Free to start — no credit card, no
              complicated setup.
            </p>
            <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-theme-600 hover:bg-theme-500 text-white font-bold shadow-[0_6px_30px_-6px_rgba(var(--theme-rgb-600),0.7)] transition-all hover:-translate-y-0.5"
              >
                <Rocket className="w-5 h-5" />
                GET STARTED
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 font-semibold transition-colors"
              >
                <LogIn className="w-5 h-5" />
                LOGIN
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/8 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <img
              src="/syed-king.png"
              alt={name}
              className="w-9 h-9 object-cover rounded-lg border border-theme-600/40"
            />
            <span className="font-extrabold tracking-tight">{name}</span>
          </div>
          <p className="max-w-md text-sm text-foreground/55">
            Fast, secure and reliable game &amp; app server hosting — with a
            panel that gets out of your way and lets you play.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {channels.map((c) => (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${c.classes}`}
              >
                <c.icon className="w-4 h-4" />
                {c.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-5 text-sm font-semibold">
            <Link to="/login" className="text-foreground/60 hover:text-foreground transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-foreground/60 hover:text-foreground transition-colors">
              Register
            </Link>
          </div>
          <p className="text-xs text-foreground/40">
            {name} — Fast, secure and reliable server hosting.
          </p>
        </div>
      </footer>

      {/* Join Our Community popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={dismissPopup}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md rounded-3xl border border-theme-600/30 bg-[#0a0a1a] p-6 sm:p-8 shadow-[0_0_60px_-10px_rgba(var(--theme-rgb-600),0.45)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={dismissPopup}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <img
                src="/syed-king.png"
                alt={name}
                className="w-16 h-16 object-cover rounded-2xl border border-theme-600/30 mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-center">
                Join Our Community
              </h2>
              <p className="mt-2 text-center text-sm text-foreground/65">
                Join our channels for the latest updates, free servers,
                giveaways and support.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {channels.map((c) => (
                  <a
                    key={c.name}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border font-semibold transition-colors ${c.classes}`}
                  >
                    <c.icon className="w-5 h-5" />
                    {c.label}
                  </a>
                ))}
              </div>

              <button
                onClick={dismissPopup}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-theme-600 hover:bg-theme-500 text-white font-semibold transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
