import React, { Component } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import SectionAura from "./SectionAura";

class Skills extends Component {
  render() {
    if (this.props.sharedSkills && this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.skills;
      var skills = this.props.sharedSkills.icons.map(function (skill, i) {
        return (
          <motion.li
            className="skill-chip"
            key={i}
            whileHover={{ y: -6, scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 18 }}
          >
            <i className={skill.class} aria-hidden="true" />
            <span>{skill.name}</span>
          </motion.li>
        );
      });
    }

    return (
      <section id="skills" className="section skills-section">
        <SectionAura variant="skills" />
        <div className="container-narrow">
          <ScrollReveal>
            <h2 className="section-heading section-heading--light">
              <span className="section-heading__index">05</span>
              {sectionName}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <ul className="skills-cloud">{skills}</ul>
          </ScrollReveal>
        </div>
      </section>
    );
  }
}

export default Skills;
