import React from "react";
import { motion } from "framer-motion";

function MotionCard({ children, className = "", onClick, asButton = true }) {
  const shared = {
    className,
    whileHover: { y: -8, scale: 1.015 },
    whileTap: { scale: 0.985 },
    transition: { type: "spring", stiffness: 320, damping: 22 },
  };

  if (asButton) {
    return (
      <motion.button type="button" onClick={onClick} {...shared}>
        {children}
      </motion.button>
    );
  }

  return (
    <motion.div {...shared} onClick={onClick}>
      {children}
    </motion.div>
  );
}

export default MotionCard;
