import { useEffect, useId, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useLoader } from "./LoaderContext";

const MIN_MS = 1600; // minimum time on screen
const MAX_MS = 4500; // hard cap: the loader ALWAYS leaves by this point

const BRAND = "#E5173F";
const EMBER = "#FF5A36";
const SAFFRON = "#F7B733";
const INK = "#0B0B0D";
const BADGE_SIZE = "clamp(132px, 34vw, 184px)";

type LoaderProps = { preload?: string[] };

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function pageReady(preload: string[]): Promise<void> {
  const windowLoaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
  const fontsReady = "fonts" in document ? document.fonts.ready.then(() => undefined) : Promise.resolve();
  const images = preload.map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      }),
  );
  return Promise.all([windowLoaded, fontsReady, ...images]).then(() => undefined);
}

export default function Loader({ preload = [] }: LoaderProps) {
  const { done, finish } = useLoader();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(!done);

  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => Math.round(v));
  const ringLength = useTransform(progress, [0, 100], [0, 1]);
  const gradientId = `loader-ring-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let current: ReturnType<typeof animate> | undefined;

    const run = async () => {
      window.scrollTo(0, 0);
      const ready = Promise.race([pageReady(preload), wait(MAX_MS)]);

      current = animate(progress, 88, { duration: reduceMotion ? 0.4 : MIN_MS / 1000, ease: [0.22, 1, 0.36, 1] });
      await Promise.all([current.then(() => undefined), ready]);
      if (cancelled) return;

      current = animate(progress, 100, { duration: 0.35, ease: "easeOut" });
      await current;
      if (cancelled) return;

      await wait(180);
      if (cancelled) return;

      finish();
      setVisible(false);
    };

    run();
    return () => {
      cancelled = true;
      current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [visible]);

  const curtainExit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.3 } }
    : { clipPath: "circle(0% at 50% 50%)", transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] as const } };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="dishcult-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading Dish Cult"
          initial={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
          animate={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
          exit={curtainExit}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: INK,
            overflow: "hidden",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "min(90vw, 620px)",
              aspectRatio: "1 / 1",
              translate: "-50% -50%",
              borderRadius: "9999px",
              background: `radial-gradient(circle, ${BRAND}33 0%, ${EMBER}14 35%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <motion.div
            exit={reduceMotion ? undefined : { scale: 0.92, transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] as const } }}
            style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
          >
            <div style={{ position: "relative", width: BADGE_SIZE, aspectRatio: "1 / 1", flexShrink: 0 }}>
              <svg
                viewBox="0 0 120 120"
                aria-hidden
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)", overflow: "visible" }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={BRAND} />
                    <stop offset="55%" stopColor={EMBER} />
                    <stop offset="100%" stopColor={SAFFRON} />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="57" fill="none" stroke="rgba(246,241,234,0.08)" strokeWidth="1.5" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="57"
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ pathLength: ringLength }}
                />
              </svg>

              <motion.img
                src="/logo-mark.svg"
                alt="Dish Cult"
                width={295}
                height={295}
                draggable={false}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={reduceMotion ? { duration: 0.3 } : { type: "spring", stiffness: 180, damping: 16, delay: 0.1 }}
                style={{
                  position: "absolute",
                  left: "10%",
                  top: "10%",
                  width: "80%",
                  height: "80%",
                  display: "block",
                  borderRadius: "9999px",
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px -12px ${BRAND}66`,
                  userSelect: "none",
                }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                marginTop: "clamp(24px, 5vh, 36px)",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                fontFamily: "Manrope, system-ui, sans-serif",
                fontVariantNumeric: "tabular-nums",
                color: "#F6F1EA",
                fontSize: "clamp(15px, 3.6vw, 17px)",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              <motion.span style={{ display: "inline-block", width: "3ch", textAlign: "right" }}>{percent}</motion.span>
              <span style={{ marginLeft: "2px", color: "#A8A29E" }}>%</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{
                margin: "12px 0 0",
                minHeight: "1.5em",
                fontFamily: "Fraunces, Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 4vw, 18px)",
                color: "#A8A29E",
                padding: "0 24px",
              }}
            >
              Booking the best tables…
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
