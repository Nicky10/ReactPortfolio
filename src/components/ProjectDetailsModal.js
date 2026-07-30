import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "../scss/light-slider.scss";
import AwesomeSliderStyles2 from "../scss/dark-slider.scss";
import "react-awesome-slider/dist/custom-animations/scale-out-animation.css";

class ProjectDetailsModal extends Component {
  render() {
    if (this.props.data) {
      const technologies = this.props.data.technologies;
      const images = this.props.data.images;
      var title = this.props.data.title;
      var description = this.props.data.description;
      var url = this.props.data.url;
      var access = this.props.data.access || "public";
      if (this.props.data.technologies) {
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
        if (this.props.data.images) {
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

    const labels = this.props.visitLabels || {};
    const visitLive = labels.visit_live || "Visit live platform";
    const visitCorporate = labels.visit_corporate || "Visit site";
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

    return (
      <Modal
        {...this.props}
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

            {canVisit ? (
              <div className="modal-visit">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary modal-visit-btn"
                >
                  <i
                    className={`fas ${
                      isCorporate ? "fa-lock" : "fa-external-link-alt"
                    }`}
                    aria-hidden="true"
                  ></i>
                  <span>{isCorporate ? visitCorporate : visitLive}</span>
                </a>
                {isCorporate ? (
                  <p className="modal-visit-note">{visitCorporateNote}</p>
                ) : null}
              </div>
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

            <p className="modal-description">{description}</p>
            <div className="col-md-12 text-center">
              <ul className="list-inline mx-auto">{tech}</ul>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ProjectDetailsModal;
