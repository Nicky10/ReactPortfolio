import React, { Component } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Badge from "react-bootstrap/Badge";
import ScrollReveal from "./ScrollReveal";
import SectionAura from "./SectionAura";

class Experience extends Component {
  render() {
    if (this.props.resumeExperience && this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.experience;
      var achievementsLabel =
        (this.props.resumeBasicInfo.ui &&
          this.props.resumeBasicInfo.ui.achievements) ||
        "Achievements";

      var work = this.props.resumeExperience.map(function (work, i) {
        const technologies = work.technologies || [];
        const mainTechnologies = work.mainTech || [];
        const highlights = work.highlights || [];
        const achievements = work.achievements || [];
        const isEducation = work.type === "education";

        var mainTech = mainTechnologies.map((technology, idx) => {
          return (
            <Badge pill className="main-badge mr-2 mb-2" key={idx}>
              {technology}
            </Badge>
          );
        });
        var tech = technologies.map((technology, idx) => {
          return (
            <Badge pill className="experience-badge mr-2 mb-2" key={idx}>
              {technology}
            </Badge>
          );
        });

        return (
          <VerticalTimelineElement
            className={`vertical-timeline-element--work experience-card ${
              isEducation ? "experience-card--education" : ""
            }`}
            date={work.years}
            iconStyle={{
              background: isEducation ? "#1e3a5f" : "#0f766e",
              color: "#fff",
              textAlign: "center",
            }}
            icon={
              <i
                className={`fas ${
                  isEducation ? "fa-graduation-cap" : "fa-briefcase"
                } experience-icon`}
              ></i>
            }
            key={i}
          >
            <div className="experience-card__badges">{mainTech}</div>

            <h3 className="vertical-timeline-element-title experience-card__title">
              {work.title}
            </h3>
            <h4 className="vertical-timeline-element-subtitle experience-card__company">
              {work.company}
              {work.location ? (
                <span className="experience-card__location">
                  {" "}
                  · {work.location}
                </span>
              ) : null}
            </h4>

            {work.summary ? (
              <p className="experience-card__summary">{work.summary}</p>
            ) : null}

            {highlights.length ? (
              <ul className="experience-card__list">
                {highlights.map(function (item, idx) {
                  return <li key={idx}>{item}</li>;
                })}
              </ul>
            ) : null}

            {achievements.length ? (
              <div className="experience-card__achievements">
                <div className="experience-card__achievements-label">
                  {achievementsLabel}
                </div>
                <ul>
                  {achievements.map(function (item, idx) {
                    return <li key={idx}>{item}</li>;
                  })}
                </ul>
              </div>
            ) : null}

            {tech.length ? (
              <div className="experience-card__tech">{tech}</div>
            ) : null}
          </VerticalTimelineElement>
        );
      });
    }

    return (
      <section id="resume" className="section experience-section">
        <SectionAura variant="experience" />
        <div className="container-narrow">
          <ScrollReveal>
            <h2 className="section-heading">
              <span className="section-heading__index">07</span>
              {sectionName}
            </h2>
          </ScrollReveal>
        </div>
        <div className="col-md-8 mx-auto experience-timeline-wrap">
          <VerticalTimeline>
            {work}
            <VerticalTimelineElement
              iconStyle={{
                background: "#0f766e",
                color: "#fff",
                textAlign: "center",
              }}
              icon={
                <i className="fas fa-flag-checkered mx-auto experience-icon"></i>
              }
            />
          </VerticalTimeline>
        </div>
      </section>
    );
  }
}

export default Experience;
