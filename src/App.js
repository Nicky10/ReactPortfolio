import React, { Component } from "react";
import $ from "jquery";
import { AnimateSharedLayout } from "framer-motion";
import "./App.scss";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Certificates from "./components/Certificates";
import ContactModal from "./components/ContactModal";
import ClickBurst from "./components/ClickBurst";

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      resumeData: {},
      sharedData: {},
      language: window.$primaryLanguage,
      contactOpen: false,
      isDark: false,
      controlsPinned: false,
    };
    this.openContact = this.openContact.bind(this);
    this.closeContact = this.closeContact.bind(this);
    this.onThemeChange = this.onThemeChange.bind(this);
    this.handleControlsScroll = this.handleControlsScroll.bind(this);
  }

  openContact() {
    this.setState({ contactOpen: true });
  }

  closeContact() {
    this.setState({ contactOpen: false });
  }

  onThemeChange(isDark) {
    this.setState({ isDark });
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }

  handleControlsScroll() {
    const about = document.getElementById("about");
    const threshold = about
      ? Math.max(about.offsetTop - 160, window.innerHeight * 0.45)
      : window.innerHeight * 0.55;
    const controlsPinned = window.scrollY > threshold;
    if (controlsPinned !== this.state.controlsPinned) {
      this.setState({ controlsPinned });
    }
  }

  applyPickedLanguage(pickedLanguage) {
    document.documentElement.lang = pickedLanguage;
    var resumePath =
      pickedLanguage === window.$primaryLanguage
        ? `res_primaryLanguage.json`
        : `res_secondaryLanguage.json`;
    this.setState({ language: pickedLanguage });
    this.loadResumeFromPath(resumePath);
  }

  componentDidMount() {
    this.loadSharedData();
    this.applyPickedLanguage(window.$primaryLanguage);
    document.body.setAttribute("data-theme", "light");
    window.addEventListener("scroll", this.handleControlsScroll, {
      passive: true,
    });
    window.addEventListener("resize", this.handleControlsScroll);
    this.handleControlsScroll();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleControlsScroll);
    window.removeEventListener("resize", this.handleControlsScroll);
  }

  loadResumeFromPath(path) {
    $.ajax({
      url: `${process.env.PUBLIC_URL}/${path}`,
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ resumeData: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(err);
      },
    });
  }

  loadSharedData() {
    $.ajax({
      url: `${process.env.PUBLIC_URL}/portfolio_shared_data.json`,
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ sharedData: data });
        document.title = `${this.state.sharedData.basic_info.name} — Portfolio`;
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(err);
      },
    });
  }

  render() {
    const resumeBasicInfo = this.state.resumeData.basic_info;
    const ui = (resumeBasicInfo && resumeBasicInfo.ui) || {};
    const contactEndpoint =
      (this.state.sharedData.basic_info &&
        this.state.sharedData.basic_info.contact_form_endpoint) ||
      "";
    const resumeHref =
      this.state.sharedData.basic_info &&
      this.state.sharedData.basic_info.resume_pdf
        ? `${process.env.PUBLIC_URL}/${this.state.sharedData.basic_info.resume_pdf}`
        : "";

    return (
      <AnimateSharedLayout type="crossfade">
        <div className="app-shell">
          <ClickBurst />
          <Navbar
            sharedBasicInfo={this.state.sharedData.basic_info}
            navLabels={ui.nav}
            onContactClick={this.openContact}
            controlsPinned={this.state.controlsPinned}
            isDark={this.state.isDark}
            onThemeChange={this.onThemeChange}
            language={this.state.language}
            onLanguageChange={(lang) => this.applyPickedLanguage(lang)}
            resumeHref={resumeHref}
          />
          <Header
            sharedData={this.state.sharedData.basic_info}
            resumeBasicInfo={resumeBasicInfo}
            language={this.state.language}
            onLanguageChange={(lang) => this.applyPickedLanguage(lang)}
            onContactClick={this.openContact}
            controlsPinned={this.state.controlsPinned}
            isDark={this.state.isDark}
            onThemeChange={this.onThemeChange}
          />

          <About
            resumeBasicInfo={resumeBasicInfo}
            sharedBasicInfo={this.state.sharedData.basic_info}
          />
          <Projects
            resumeProjects={this.state.resumeData.projects}
            resumeBasicInfo={resumeBasicInfo}
          />
          <Skills
            sharedSkills={this.state.sharedData.skills}
            resumeBasicInfo={resumeBasicInfo}
          />
          <Certificates
            resumeCertificates={this.state.resumeData.certificates}
            resumeBasicInfo={resumeBasicInfo}
          />
          <Experience
            resumeExperience={this.state.resumeData.experience}
            resumeBasicInfo={resumeBasicInfo}
          />
          <Footer
            sharedBasicInfo={this.state.sharedData.basic_info}
            footerTagline={ui.footer_tagline}
            onContactClick={this.openContact}
          />

          <ContactModal
            show={this.state.contactOpen}
            onHide={this.closeContact}
            endpoint={contactEndpoint}
            labels={ui.contact}
            language={this.state.language}
          />
        </div>
      </AnimateSharedLayout>
    );
  }
}

export default App;
