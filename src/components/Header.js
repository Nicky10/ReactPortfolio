import React, { Component } from "react";
import Typical from "react-typical";
import { motion } from "framer-motion";
import HeroScene from "./HeroScene";
import {
  ThemeToggle,
  LangToggle,
  HeroThemeHandoff,
  HeroLangHandoff,
} from "./SiteControls";

class Header extends Component {
  scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  getTitles() {
    const fromResume =
      this.props.resumeBasicInfo && this.props.resumeBasicInfo.titles;
    const fromShared =
      this.props.sharedData && this.props.sharedData.titles;
    const titles = fromResume || fromShared || [];
    return titles.map((x) => [x.toUpperCase(), 1800]).flat();
  }

  render() {
    const name =
      (this.props.sharedData && this.props.sharedData.name) ||
      "Nicolas Delgado";
    const ui =
      (this.props.resumeBasicInfo && this.props.resumeBasicInfo.ui) || {};
    const hero = ui.hero || {};
    const titles = this.getTitles();
    const pinned = this.props.controlsPinned;

    const HeaderTitleTypeAnimation = React.memo(
      () => {
        if (!titles.length) return null;
        return <Typical className="title-styles" steps={titles} loop={50} />;
      },
      () => true
    );

    const fadeUp = (delay) => ({
      initial: { opacity: 0, y: 22 },
      animate: { opacity: 1, y: 0 },
      transition: {
        delay,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    });

    return (
      <header id="home" className="hero">
        <HeroScene>
          <div className="hero__orb hero__orb--one" aria-hidden="true" />
          <div className="hero__orb hero__orb--two" aria-hidden="true" />

          <div className="hero__content">
            <motion.p className="hero__eyebrow" {...fadeUp(0.05)}>
              {hero.eyebrow || "Software Engineer"}
            </motion.p>
            <motion.h1 className="hero__name" {...fadeUp(0.15)}>
              {name}
            </motion.h1>
            <motion.div
              className="hero__roles"
              key={this.props.language + titles.join("|")}
              {...fadeUp(0.28)}
            >
              <HeaderTitleTypeAnimation />
            </motion.div>
            <motion.p className="hero__lead" {...fadeUp(0.4)}>
              {hero.lead}
            </motion.p>

            <HeroThemeHandoff pinned={pinned}>
              <ThemeToggle
                isDark={this.props.isDark}
                onThemeChange={this.props.onThemeChange}
                labels={hero}
              />
            </HeroThemeHandoff>
          </div>

          <div className="hero__bottom">
            <HeroLangHandoff pinned={pinned}>
              <LangToggle
                language={this.props.language}
                onLanguageChange={this.props.onLanguageChange}
              />
            </HeroLangHandoff>

            <motion.button
              type="button"
              className="hero__scroll"
              onClick={() => this.scrollTo("about")}
              aria-label={hero.scroll || "Scroll to about"}
              whileHover={{ y: 3, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              animate={{
                opacity: pinned ? 0 : 1,
                pointerEvents: pinned ? "none" : "auto",
              }}
              transition={{ duration: 0.3 }}
            >
              <i className="fas fa-chevron-down" aria-hidden="true"></i>
            </motion.button>
          </div>
        </HeroScene>
      </header>
    );
  }
}

export default Header;
