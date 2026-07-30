import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BURST_CHARS = ["</>", "{}", "=>", ";", "()", "[]", "&&", "fn"];

function createRipples(x, y) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const particles = BURST_CHARS.map((text, index) => {
    const angle = (Math.PI * 2 * index) / BURST_CHARS.length + Math.random() * 0.35;
    const distance = 48 + Math.random() * 56;
    return {
      id: `${id}-${index}`,
      text,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: (Math.random() - 0.5) * 40,
    };
  });

  return { id, x, y, particles };
}

function isInteractiveTarget(target) {
  if (!target || !target.closest) return false;
  return Boolean(
    target.closest(
      "a, button, input, textarea, select, label, .modal, .contact-modal, .project-card__button, .cert-card__button, .lang-toggle, .react-switch, .site-nav, .hero-terminal, [role='dialog'], [contenteditable='true']"
    )
  );
}

function ClickBurst() {
  const [bursts, setBursts] = useState([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  const handleClick = useCallback(
    (event) => {
      if (reduced) return;
      if (event.button !== 0) return;
      if (isInteractiveTarget(event.target)) return;

      const next = createRipples(event.clientX, event.clientY);
      setBursts((prev) => [...prev.slice(-4), next]);
    },
    [reduced]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [handleClick]);

  const removeBurst = (id) => {
    setBursts((prev) => prev.filter((burst) => burst.id !== id));
  };

  return (
    <div className="click-burst-layer" aria-hidden="true">
      <AnimatePresence>
        {bursts.map((burst) => (
          <span
            key={burst.id}
            className="click-burst"
            style={{ left: burst.x, top: burst.y }}
          >
            <motion.span
              className="click-burst__ring"
              initial={{ scale: 0.2, opacity: 0.55 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => removeBurst(burst.id)}
            />
            <motion.span
              className="click-burst__core"
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
            {burst.particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="click-burst__particle"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: [0, 0.95, 0],
                  scale: [0.6, 1, 0.8],
                  rotate: particle.rotate,
                }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                {particle.text}
              </motion.span>
            ))}
          </span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ClickBurst;
