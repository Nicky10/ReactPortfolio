import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "../scss/light-slider.scss";
import AwesomeSliderStyles2 from "../scss/dark-slider.scss";
import "react-awesome-slider/dist/custom-animations/scale-out-animation.css";
import ProjectImpactMetrics from "./ProjectImpactMetrics";
import ProjectImpactDetail from "./ProjectImpactDetail";
import TechStack from "./TechStack";

class ProjectDetailsModal extends Component {
  render() {
    const {
      data,
      visitLabels,
      impactLabels,
      stackLabels,
      ...modalProps
    } = this.props;

    if (data) {
      const technologies = data.technologies;
      const images = data.images;
      var title = data.title;
      var description = data.description;
      var url = data.url;
      var access = data.access || "public";
      if (data.technologies) {
        var tech = technologies.map((icons, i) => {
          return (
            <li className="list-inline-item mx-3" key={i}>
              <span>
                <div className="text-center">
                  <i className={icons.class} style={{ fontSize: "260%" }}>
                    <p className="text-center" style={{ fontSize: "30%" }}>
                      {icons.name}
                    </p>
                  </i>
                </div>
              </span>
            </li>
          );
        });
        if (data.images) {
          var img = images.map((elem, i) => {
            return (
              <div
                key={i}
                data-src={`${process.env.PUBLIC_URL}/` + elem}
              />
            );
          });
        }
      }
    }

    const labels = visitLabels || {};
    const resolvedImpactLabels = impactLabels || labels.project_impact || {};
    const visitLive = labels.visit_live || "Visit live platform";
    const visitCorporateNote =
      labels.visit_corporate_note ||
      "Corporate login required — public access is not available.";
    const visitOffline = labels.visit_offline || "Not currently live";
    const visitOfflineNote =
      labels.visit_offline_note ||
      "This project is no longer publicly available online.";

    const isOffline = access === "offline";
    const isCorporate = access === "corporate";
    const canVisit = Boolean(url) && !isOffline;
    const impactMetrics = data && data.impact_metrics;
    const impactDetail = data && data.impact_detail;
    const techStack = data && data.tech_stack;
    const resolvedStackLabels = stackLabels || labels.tech_stack || {};
    const availabilityNote =
      (impactDetail && impactDetail.availability_note) ||
      (isCorporate ? visitCorporateNote : "");

    return (
      <Modal
        {...modalProps}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal-inside"
      >
        <span onClick={this.props.onHide} className="modal-close">
          <i className="fas fa-times fa-2x close-icon"></i>
        </span>
        <div className="col-md-12">
          <div className="col-md-10 mx-auto" style={{ paddingBottom: "40px" }}>
            <div className="slider-tab">
              <span
                className="iconify slider-iconfiy"
                data-icon="emojione:red-circle"
                data-inline="false"
                style={{ marginLeft: "5px" }}
              ></span>{" "}
              &nbsp;{" "}
              <span
                className="iconify slider-iconfiy"
                data-icon="twemoji:yellow-circle"
                data-inline="false"
              ></span>{" "}
              &nbsp;{" "}
              <span
                className="iconify slider-iconfiy"
                data-icon="twemoji:green-circle"
                data-inline="false"
              ></span>
            </div>
            <AwesomeSlider
              cssModule={[AwesomeSliderStyles, AwesomeSliderStyles2]}
              animation="scaleOutAnimation"
              className="slider-image"
            >
              {img}
            </AwesomeSlider>
          </div>
          <div className="col-md-10 mx-auto modal-project-body">
            <h3 className="modal-project-title">{title}</h3>

            {canVisit && !isCorporate ? (
              <div className="modal-visit">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary modal-visit-btn"
                >
                  <i
                    className="fas fa-external-link-alt"
                    aria-hidden="true"
                  ></i>
                  <span>{visitLive}</span>
                </a>
              </div>
            ) : null}

            {isCorporate && availabilityNote ? (
              <p className="modal-visit-note" role="note">
                {availabilityNote}
              </p>
            ) : null}

            {isOffline ? (
              <div className="modal-visit modal-visit--offline">
                <span className="modal-visit-badge">
                  <i className="fas fa-unlink" aria-hidden="true"></i>
                  {visitOffline}
                </span>
                <p className="modal-visit-note">{visitOfflineNote}</p>
              </div>
            ) : null}

            <ProjectImpactMetrics metrics={impactMetrics} />
            <p className="modal-description">{description}</p>
            <ProjectImpactDetail
              detail={impactDetail}
              labels={resolvedImpactLabels}
              hideOutcomes={Boolean(impactMetrics && impactMetrics.length)}
              hideTechnologies={Boolean(techStack)}
              hideIntegrations={Boolean(techStack && techStack.integrations)}
            />
            {techStack ? (
              <TechStack stack={techStack} labels={resolvedStackLabels} />
            ) : (
              <div className="col-md-12 text-center">
                <ul className="list-inline mx-auto">{tech}</ul>
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ProjectDetailsModal;
