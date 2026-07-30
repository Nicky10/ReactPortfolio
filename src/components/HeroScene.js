import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const CODE_TOKENS = [
  { text: "const stack = ['TS', 'React', 'Nest']", x: 8, y: 16, depth: 0.35, delay: 0.1 },
  { text: "async function shipProduct()", x: 70, y: 14, depth: 0.55, delay: 0.2 },
  { text: "await api.deploy()", x: 78, y: 38, depth: 0.7, delay: 0.15 },
  { text: "<FullStack />", x: 6, y: 42, depth: 0.45, delay: 0.25 },
  { text: "{ cleanCode: true }", x: 82, y: 62, depth: 0.5, delay: 0.3 },
  { text: "git commit -m 'ship it'", x: 10, y: 68, depth: 0.6, delay: 0.18 },
  { text: "SELECT * FROM impact", x: 62, y: 78, depth: 0.4, delay: 0.22 },
  { text: "=> scalable systems", x: 28, y: 86, depth: 0.65, delay: 0.12 },
  { text: "TypeScript", x: 48, y: 12, depth: 0.3, delay: 0.08 },
  { text: "PostgreSQL", x: 88, y: 48, depth: 0.48, delay: 0.28 },
];

function FloatingToken({ token, mx, my, reduced }) {
  const x = useTransform(mx, (v) => (reduced ? 0 : v * -55 * token.depth));
  const y = useTransform(my, (v) => (reduced ? 0 : v * -40 * token.depth));

  return (
    <motion.span
      className="hero-code__token"
      style={{
        left: `${token.x}%`,
        top: `${token.y}%`,
        x,
        y,
      }}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 0.5 + token.depth * 0.4, y: 0 }}
      transition={{
        delay: token.delay,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden="true"
    >
      {token.text}
    </motion.span>
  );
}

function HeroScene({ children }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
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

  const spotlightX = useTransform(mx, [-0.5, 0.5], ["18%", "82%"]);
  const spotlightY = useTransform(my, [-0.5, 0.5], ["22%", "78%"]);
  const layerSlowX = useTransform(mx, (v) => (reduced ? 0 : v * -18));
  const layerSlowY = useTransform(my, (v) => (reduced ? 0 : v * -12));
  const layerFastX = useTransform(mx, (v) => (reduced ? 0 : v * -42));
  const layerFastY = useTransform(my, (v) => (reduced ? 0 : v * -28));
  const tiltX = useTransform(my, [-0.5, 0.5], [5, -5]);
  const tiltY = useTransform(mx, [-0.5, 0.5], [-7, 7]);
  const terminalX = useTransform(mx, (v) => (reduced ? 0 : v * 28));
  const terminalY = useTransform(my, (v) => (reduced ? 0 : v * 18));

  const tokens = useMemo(() => CODE_TOKENS, []);

  const handleMove = (event) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    mx.set(Math.max(-0.5, Math.min(0.5, px)));
    my.set(Math.max(-0.5, Math.min(0.5, py)));
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      className="hero-scene"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div
        className="hero-scene__spotlight"
        style={{ left: spotlightX, top: spotlightY }}
        aria-hidden="true"
      />

      <motion.div
        className="hero-scene__grid"
        style={{ x: layerSlowX, y: layerSlowY }}
        aria-hidden="true"
      />

      <div className="hero-code" aria-hidden="true">
        {tokens.map((token) => (
          <FloatingToken
            key={token.text}
            token={token}
            mx={mx}
            my={my}
            reduced={reduced}
          />
        ))}
      </div>

      <motion.div
        className="hero-terminal"
        style={{
          x: terminalX,
          y: terminalY,
          rotateX: tiltX,
          rotateY: tiltY,
        }}
        initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <div className="hero-terminal__bar">
          <span />
          <span />
          <span />
          <em>nicolas — zsh</em>
        </div>
        <pre className="hero-terminal__body">
          <code>
            <span className="c-comment"># shipping software, every day</span>
            {"\n"}
            <span className="c-prompt">$</span> npm run build
            {"\n"}
            <span className="c-ok">✓</span> compiled successfully
            {"\n"}
            <span className="c-prompt">$</span> git push origin main
            {"\n"}
            <span className="c-accent">→</span> deploy live
          </code>
        </pre>
      </motion.div>

      <motion.div
        className="hero-brackets"
        style={{ x: layerFastX, y: layerFastY }}
        aria-hidden="true"
      >
        <span>{"</>"}</span>
        <span>{"{ }"}</span>
        <span>{"( )"}</span>
      </motion.div>

      <div className="hero-scene__content">{children}</div>
    </div>
  );
}

export default HeroScene;
