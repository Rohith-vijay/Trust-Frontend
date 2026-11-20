import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import api from "../../services/api";

const POLL_MS = 20000;
const VISIBLE = 4;
// Older entries fade out: index 0 = newest (top), higher = older (further down)
const FADE = [1, 0.78, 0.55, 0.34];

/** Super-Chat style tiers: bigger gift → warmer colour. */
const TIERS = [
  { min: 10000, cls: "tier-5" },
  { min: 5000, cls: "tier-4" },
  { min: 1000, cls: "tier-3" },
  { min: 500, cls: "tier-2" },
  { min: 0, cls: "tier-1" },
];
const tierFor = (amount) => TIERS.find((t) => amount >= t.min)?.cls ?? "tier-1";

function timeAgo(iso, now) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const s = Math.max(0, Math.floor((now - t) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// Stable identity for a donation (the API intentionally exposes no ids)
const keyOf = (d) => `${d.donatedAt}|${d.name}|${d.amount}`;

const HeroLeaderboard = memo(function HeroLeaderboard() {
  const reduceMotion = useReducedMotion();
  const [donors, setDonors] = useState([]);
  const [now, setNow] = useState(() => Date.now());
  const seen = useRef(new Set());
  const [fresh, setFresh] = useState(() => new Set());

  const load = useCallback(async (signal) => {
    try {
      const res = await api.get("/public/donations/leaderboard", { params: { limit: 20 }, signal, skipGlobalToast: true });
      if (!Array.isArray(res.data)) return;
      const list = res.data.filter((d) => d && Number(d.amount) > 0);
      const incoming = new Set();
      if (seen.current.size > 0) {
        list.forEach((d) => {
          if (!seen.current.has(keyOf(d))) incoming.add(keyOf(d));
        });
      }
      list.forEach((d) => seen.current.add(keyOf(d)));
      setDonors(list);
      if (incoming.size) {
        setFresh(incoming);
        setTimeout(() => setFresh(new Set()), 6000);
      }
    } catch (err) {
      // Background widget: stay silent on failure (the feed simply keeps its last data)
      if (err?.code !== "ERR_CANCELED") console.warn("Live donations unavailable:", err?.message);
    }
  }, []);

  // Poll only while the tab is visible
  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => load(controller.signal));
    const id = setInterval(() => {
      if (!document.hidden) load(controller.signal);
    }, POLL_MS);
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      controller.abort();
      clearInterval(id);
      clearInterval(tick);
    };
  }, [load]);

  // Only the latest 4: newest on top; a new gift slides in at the top, the rest move down and the oldest drops off
  const rows = useMemo(() => donors.slice(0, VISIBLE).map((d, depth) => ({ d, depth })), [donors]);

  // Nothing to show (no donations yet / API unavailable): render nothing, not an empty box
  if (donors.length === 0) return null;

  return (
    <aside className="hero-lb" aria-label="Live donations">
      <div className="hero-lb__head">
        <span className="hero-lb__dot" aria-hidden="true" />
        Live Donations
      </div>

      <ul className="hero-lb__list" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map(({ d, depth }) => {
            const amount = Number(d.amount);
            const isNew = fresh.has(keyOf(d));
            return (
              <motion.li
                key={keyOf(d)}
                layout={!reduceMotion}
                data-depth={depth}
                initial={reduceMotion ? false : { opacity: 0, y: -18 }}
                animate={{ opacity: FADE[depth] ?? 0.3, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`hero-lb__item ${tierFor(amount)}${isNew ? " is-new" : ""}`}
              >
                <span className="hero-lb__who">
                  <span className="hero-lb__name">{d.name}</span>
                  <span className="hero-lb__time">{timeAgo(d.donatedAt, now)}</span>
                </span>
                <span className="hero-lb__amount">₹{amount.toLocaleString("en-IN")}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </aside>
  );
});

export default HeroLeaderboard;
