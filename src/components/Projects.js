import React, { Component } from "react";
import ProjectDetailsModal from "./ProjectDetailsModal";
import ScrollReveal from "./ScrollReveal";
import MotionCard from "./MotionCard";
import SectionAura from "./SectionAura";
import ProjectImpactMetrics from "./ProjectImpactMetrics";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deps: {},
      detailsModalShow: false,
    };
  }

  render() {
    let detailsModalShow = (data) => {
      this.setState({ detailsModalShow: true, deps: data });
    };

    let detailsModalClose = () => this.setState({ detailsModalShow: false });

    var sectionName;
    var projects;
    var projectsLead = "";

    if (this.props.resumeProjects && this.props.resumeBasicInfo) {
      sectionName = this.props.resumeBasicInfo.section_name.projects;
      var ui = this.props.resumeBasicInfo.ui || {};
      projectsLead = ui.projects_lead || "";
      var featuredLabel = ui.featured || "Featured";
      var detailsLabel = ui.project_details || "View details";
      projects = this.props.resumeProjects.map(function (project, index) {
        const techs = project.technologies || [];
        const techPreview = techs.map((t) => t.name).join(" · ");
        const description = project.description || "";

        return (
          <ScrollReveal
            key={project.title}
            className={`project-card ${
              project.featured ? "project-card--featured" : ""
            }`}
            delay={index * 60}
          >
            <MotionCard
              className="project-card__button"
              onClick={() => detailsModalShow(project)}
            >
              <div className="project-card__media">
                <img
                  src={`${process.env.PUBLIC_URL}/` + project.images[0]}
                  alt={project.title}
                />
                {project.featured ? (
                  <span className="project-card__badge">{featuredLabel}</span>
                ) : null}
              </div>
              <div className="project-card__body">
                <span className="project-card__date">{project.startDate}</span>
                <h3>{project.title}</h3>
                {techPreview ? (
                  <p className="project-card__tech">{techPreview}</p>
                ) : null}
                <p className="project-card__excerpt">{description}</p>
                <ProjectImpactMetrics metrics={project.impact_metrics} />
                <span className="project-card__more">
                  {detailsLabel}
                  <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </span>
              </div>
            </MotionCard>
          </ScrollReveal>
        );
      });
    }

    return (
      <section id="portfolio" className="section projects-section">
        <SectionAura variant="projects" />
        <div className="container-narrow">
          <ScrollReveal>
            <h2 className="section-heading">
              <span className="section-heading__index">02</span>
              {sectionName}
            </h2>
            <p className="section-lead">{projectsLead}</p>
          </ScrollReveal>

          <div className="projects-grid">{projects}</div>

          <ProjectDetailsModal
            show={this.state.detailsModalShow}
            onHide={detailsModalClose}
            data={this.state.deps}
            visitLabels={
              (this.props.resumeBasicInfo && this.props.resumeBasicInfo.ui) ||
              {}
            }
            impactLabels={
              (this.props.resumeBasicInfo &&
                this.props.resumeBasicInfo.ui &&
                this.props.resumeBasicInfo.ui.project_impact) ||
              {}
            }
          />
        </div>
      </section>
    );
  }
}

export default Projects;
