import React, { Component } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import reactIcon from "@iconify/icons-logos/react";
import nodejsIcon from "@iconify/icons-logos/nodejs-icon";
import ScrollReveal from "./ScrollReveal";
import SectionAura from "./SectionAura";

class About extends Component {
  render() {
    var profilepic;
    var sectionName;
    var hello;
    var about;
    var highlights = [];
    var downloadLabel = "Download resume";
    var resumeHref = "";

    if (this.props.sharedBasicInfo) {
      profilepic =
        `${process.env.PUBLIC_URL}/images/` +
        this.props.sharedBasicInfo.image;
      if (this.props.sharedBasicInfo.resume_pdf) {
        resumeHref =
          `${process.env.PUBLIC_URL}/` + this.props.sharedBasicInfo.resume_pdf;
      }
    }
    if (this.props.resumeBasicInfo) {
      sectionName = this.props.resumeBasicInfo.section_name.about;
      hello = this.props.resumeBasicInfo.description_header;
      about = this.props.resumeBasicInfo.description;
      highlights = this.props.resumeBasicInfo.highlights || [];
      const ui = this.props.resumeBasicInfo.ui || {};
      downloadLabel = ui.download_resume || downloadLabel;
    }

    return (
      <section id="about" className="section about-section">
        <SectionAura variant="about" />
        <div className="container-narrow">
          <ScrollReveal>
            <h2 className="section-heading">
              <span className="section-heading__index">01</span>
              {sectionName}
            </h2>
          </ScrollReveal>

          <div className="about-grid">
            <ScrollReveal className="about-photo" delay={80}>
              <motion.div
                className="about-photo__frame"
                whileHover={{ y: -6, rotate: -1.2 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <img src={profilepic} alt="Nicolas Delgado" />
                <div className="about-photo__stack">
                  <Icon icon={reactIcon} style={{ fontSize: "2.4rem" }} />
                  <Icon icon={nodejsIcon} style={{ fontSize: "2.4rem" }} />
                </div>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <div className="about-copy">
                <p className="about-copy__hello">{hello}</p>
                <p className="about-copy__body">{about}</p>
                <div className="about-highlights">
                  {highlights.map(function (item, i) {
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ y: -4, scale: 1.03 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 18,
                        }}
                      >
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
                {resumeHref ? (
                  <a
                    className="about-resume-btn"
                    href={resumeHref}
                    download="Resume_Nicolas_Delgado.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-download" aria-hidden="true"></i>
                    {downloadLabel}
                  </a>
                ) : null}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }
}

export default About;
