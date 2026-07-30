import React from "react";
import Switch from "react-switch";
import { motion } from "framer-motion";

export function ThemeToggle({ isDark, onThemeChange, labels = {}, compact = false }) {
  return (
    <div
      className={
        compact ? "theme-toggle theme-toggle--compact" : "hero__theme"
      }
    >
      {!compact ? (
        <span className="hero__theme-label" aria-hidden="true">
          {isDark ? labels.dark || "Dark" : labels.light || "Light"}
        </span>
      ) : null}
      <Switch
        checked={isDark}
        onChange={onThemeChange}
        offColor="#94a3b8"
        onColor="#0f766e"
        className="react-switch"
        width={compact ? 52 : 64}
        height={compact ? 26 : 32}
        handleDiameter={compact ? 22 : 26}
        uncheckedIcon={
          <span className="theme-switch-icon theme-switch-icon--sun">
            <span
              className="iconify"
              data-icon="twemoji:sun"
              data-inline="false"
            ></span>
          </span>
        }
        checkedIcon={
          <span className="theme-switch-icon theme-switch-icon--moon">
            <span
              className="iconify"
              data-icon="twemoji:crescent-moon"
              data-inline="false"
            ></span>
          </span>
        }
        aria-label="Toggle light and dark mode"
      />
      {!compact ? (
        <span className="hero__theme-hint">{labels.mode || "mode"}</span>
      ) : null}
    </div>
  );
}

export function LangToggle({ language, onLanguageChange, compact = false }) {
  const isEnglish = language === window.$primaryLanguage;

  return (
    <div
      className={`lang-toggle ${compact ? "lang-toggle--compact" : ""}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={`lang-toggle__option ${isEnglish ? "is-active" : ""}`}
        onClick={() => onLanguageChange(window.$primaryLanguage)}
        aria-pressed={isEnglish}
      >
        <span
          className="iconify lang-toggle__flag"
          data-icon="twemoji-flag-for-flag-united-states"
          data-inline="false"
        ></span>
        EN
      </button>
      <button
        type="button"
        className={`lang-toggle__option ${!isEnglish ? "is-active" : ""}`}
        onClick={() => onLanguageChange(window.$secondaryLanguage)}
        aria-pressed={!isEnglish}
      >
        <span
          className="iconify lang-toggle__flag"
          data-icon="twemoji-flag-for-flag-france"
          data-inline="false"
        ></span>
        FR
      </button>
    </div>
  );
}

const handoffTransition = {
  type: "spring",
  stiffness: 380,
  damping: 34,
  mass: 0.85,
};

export function HeroThemeHandoff({ pinned, children }) {
  if (pinned) return null;
  return (
    <motion.div
      className="hero__control-handoff"
      layoutId="control-theme"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={handoffTransition}
    >
      {children}
    </motion.div>
  );
}

export function HeroLangHandoff({ pinned, children }) {
  if (pinned) return null;
  return (
    <motion.div
      layoutId="control-lang"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={handoffTransition}
    >
      {children}
    </motion.div>
  );
}

export function FloatingNavControls(props) {
  return (
    <div className="nav-controls-slot">
      <div className="site-controls site-controls--compact">
        <motion.div layoutId="control-theme" transition={handoffTransition}>
          <ThemeToggle
            compact
            isDark={props.isDark}
            onThemeChange={props.onThemeChange}
          />
        </motion.div>
        <motion.div layoutId="control-lang" transition={handoffTransition}>
          <LangToggle
            compact
            language={props.language}
            onLanguageChange={props.onLanguageChange}
          />
        </motion.div>
      </div>
    </div>
  );
}
