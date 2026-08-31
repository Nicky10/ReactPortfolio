import React, { Component } from "react";
import CertificateDetailsModal from "./CertificateDetailsModal";
import ScrollReveal from "./ScrollReveal";
import MotionCard from "./MotionCard";
import SectionAura from "./SectionAura";

class Certificates extends Component {
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

    if (this.props.resumeCertificates && this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.certificates;
      var certificates = this.props.resumeCertificates.map(function (
        certificate,
        index
      ) {
        return (
          <ScrollReveal
            key={certificate.title}
            className="cert-card"
            delay={index * 50}
          >
            <MotionCard
              className="cert-card__button"
              onClick={() => detailsModalShow(certificate)}
            >
              <img
                src={`${process.env.PUBLIC_URL}/` + certificate.images[0]}
                alt={certificate.title}
              />
              <div className="cert-card__meta">
                <span>{certificate.startDate}</span>
                <h3>{certificate.title}</h3>
              </div>
            </MotionCard>
          </ScrollReveal>
        );
      });
    }

    return (
      <section id="certificates" className="section certificates-section">
        <SectionAura variant="certs" />
        <div className="container-narrow">
          <ScrollReveal>
            <h2 className="section-heading">
              <span className="section-heading__index">06</span>
              {sectionName}
            </h2>
          </ScrollReveal>
          <div className="certs-grid">{certificates}</div>
          <CertificateDetailsModal
            show={this.state.detailsModalShow}
            onHide={detailsModalClose}
            data={this.state.deps}
          />
        </div>
      </section>
    );
  }
}

export default Certificates;
