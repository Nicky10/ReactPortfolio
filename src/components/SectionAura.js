import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function SectionAura({ variant = "default" }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 26, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 90, damping: 26, mass: 0.5 });
  const [reduced, setReduced] = useState(false);
  const spotX = useTransform(smx, [-0.5, 0.5], ["20%", "80%"]);
  const spotY = useTransform(smy, [-0.5, 0.5], ["25%", "75%"]);

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

  useEffect(() => {
    const section = ref.current && ref.current.parentElement;
    if (!section) return undefined;

    const onMove = (event) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.height < 1 || rect.width < 1) return;
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      mx.set(Math.max(-0.5, Math.min(0.5, px)));
      my.set(Math.max(-0.5, Math.min(0.5, py)));
    };

    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, [mx, my, reduced]);

  return (
    <div
      ref={ref}
      className={`section-aura section-aura--${variant}`}
      aria-hidden="true"
    >
      <div className="section-aura__mesh" />
      <div className="section-aura__grid" />
      <div className="section-aura__grain" />
      <div className="section-aura__glow section-aura__glow--a" />
      <div className="section-aura__glow section-aura__glow--b" />
      <div className="section-aura__glow section-aura__glow--c" />
      <motion.div
        className="section-aura__spot"
        style={{ left: spotX, top: spotY }}
      />
      <div className="section-aura__vignette" />
    </div>
  );
}

export default SectionAura;
