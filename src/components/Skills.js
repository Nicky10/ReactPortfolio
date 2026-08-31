import React, { Component } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import SectionAura from "./SectionAura";
import { projectsForSkill } from "./skillProjects";

class Skills extends Component {
  render() {
    var sectionName;
    var skills;
    var usedInLabel = "Used in";
    var unusedLabel = "Not listed on a published project";
    var projects = this.props.resumeProjects || [];

    if (this.props.sharedSkills && this.props.resumeBasicInfo) {
      sectionName = this.props.resumeBasicInfo.section_name.skills;
      const ui = this.props.resumeBasicInfo.ui || {};
      usedInLabel = ui.skills_used_in || usedInLabel;
      unusedLabel = ui.skills_unused || unusedLabel;
      skills = this.props.sharedSkills.icons.map(function (skill, i) {
        const related = projectsForSkill(skill.name, projects);
        const tooltipId = "skill-tip-" + i;

        return (
          <motion.li
            className="skill-chip"
            key={skill.name}
            tabIndex="0"
            aria-describedby={tooltipId}
            whileHover={{ y: -6, scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 18 }}
          >
            <i className={skill.class} aria-hidden="true" />
            <span>{skill.name}</span>
            <div id={tooltipId} className="skill-chip__tooltip" role="tooltip">
              <strong>{related.length ? usedInLabel : unusedLabel}</strong>
              {related.length ? (
                <ul>
                  {related.map(function (title) {
                    return <li key={title}>{title}</li>;
                  })}
                </ul>
              ) : null}
            </div>
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
              <span className="section-heading__index">04</span>
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
