import React, { Component } from "react";
import CertificateDetailsModal from "./CertificateDetailsModal";

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
      var certificates = this.props.resumeCertificates.map(function (certificates) {
        return (
          <div
            className="col-sm-12 col-md-6 col-lg-4"
            key={certificates.title}
            style={{ cursor: "pointer" }}
          >
            <span className="portfolio-item d-block">
              <div className="foto" onClick={() => detailsModalShow(certificates)}>
                <div>
                  <img
                    src={certificates.images[0]}
                    alt="certificateImages"
                    height="230"
                    style={{marginBottom: 0, paddingBottom: 0, position: 'relative'}}
                  />
                  <span className="certificate-date">{certificates.startDate}</span>
                  <br />
                  <p className="certificate-title-settings mt-3">
                    {certificates.title}
                  </p>
                </div>
              </div>
            </span>
          </div>
        );
      });
    }

    return (
      <section id="portfolio">
        <div className="col-md-12">
          <h1 className="section-title" style={{ color: "black" }}>
            <span>{sectionName}</span>
          </h1>
          <div className="col-md-12 mx-auto">
            <div className="row mx-auto">{certificates}</div>
          </div>
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
