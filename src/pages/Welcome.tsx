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

const features = [
  { icon: Zap, title: "Instant Setup", text: "Your server is ready in seconds" },
  { icon: Gauge, title: "High Performance", text: "Fast nodes with SSD storage" },
  { icon: Clock, title: "24/7 Online", text: "Your servers never sleep" },
];

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

  const dismissPopup = () => {
    setShowPopup(false);
    try {
      sessionStorage.setItem(POPUP_FLAG, "1");
    } catch {
      /* sessionStorage unavailable */
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#050510] text-foreground relative overflow-hidden flex flex-col">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-theme-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-theme-800/10 blur-[110px] rounded-full pointer-events-none" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <motion.img
          src="/syed-king.png"
          alt={name}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-3xl border border-theme-600/30 shadow-[0_0_50px_-10px_rgba(var(--theme-rgb-600),0.5)] mb-7"
        />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-4 max-w-xl text-base sm:text-lg text-foreground/70"
        >
          Premium Game &amp; App Server Hosting Panel — deploy your server in
          seconds and manage everything from one powerful dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-theme-600 hover:bg-theme-500 text-white font-semibold shadow-[0_4px_24px_-4px_rgba(var(--theme-rgb-600),0.6)] transition-colors"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl"
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="flex sm:flex-col items-center gap-3 sm:gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <f.icon className="w-6 h-6 text-theme-400 shrink-0" />
              <div className="text-left sm:text-center">
                <div className="font-semibold">{f.title}</div>
                <div className="text-sm text-foreground/60">{f.text}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="relative z-10 pb-6 text-center text-xs text-foreground/40">
        {name} — Fast, secure and reliable server hosting.
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
