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
import ContentLoadError from "./components/ContentLoadError";
import CaseStudies from "./components/CaseStudies";
import DeliveryCapabilities from "./components/DeliveryCapabilities";

function hasUsableResumeData(resumeData) {
  return Boolean(resumeData && resumeData.basic_info);
}

function contactMailtoFromShared(sharedData) {
  const social =
    (sharedData && sharedData.basic_info && sharedData.basic_info.social) || [];
  const mail = social.find(
    (entry) =>
      entry &&
      (entry.name === "mail" ||
        (typeof entry.url === "string" && entry.url.indexOf("mailto:") === 0))
  );
  return mail && mail.url ? mail.url : "";
}

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
      sharedLoadError: false,
      localizedLoadError: false,
      pendingLocalizedPath: null,
      pendingLanguage: null,
    };
    this.openContact = this.openContact.bind(this);
    this.closeContact = this.closeContact.bind(this);
    this.onThemeChange = this.onThemeChange.bind(this);
    this.handleControlsScroll = this.handleControlsScroll.bind(this);
    this.retryContentLoad = this.retryContentLoad.bind(this);
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
    var resumePath =
      pickedLanguage === window.$primaryLanguage
        ? `res_primaryLanguage.json`
        : `res_secondaryLanguage.json`;
    var keepCurrentLanguage = hasUsableResumeData(this.state.resumeData);
    if (!keepCurrentLanguage) {
      document.documentElement.lang = pickedLanguage;
      this.setState({ language: pickedLanguage });
    }
    this.loadResumeFromPath(resumePath, pickedLanguage);
  }

  retryContentLoad() {
    if (this.state.sharedLoadError) {
      this.loadSharedData();
    }
    if (this.state.localizedLoadError) {
      var path =
        this.state.pendingLocalizedPath ||
        (this.state.language === window.$primaryLanguage
          ? `res_primaryLanguage.json`
          : `res_secondaryLanguage.json`);
      this.loadResumeFromPath(
        path,
        this.state.pendingLanguage || this.state.language
      );
    }
  }

  componentDidMount() {
    this._isMounted = true;
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
    this._isMounted = false;
    window.removeEventListener("scroll", this.handleControlsScroll);
    window.removeEventListener("resize", this.handleControlsScroll);
  }

  loadResumeFromPath(path, intendedLanguage) {
    $.ajax({
      url: `${process.env.PUBLIC_URL}/${path}`,
      dataType: "json",
      cache: false,
      success: function (data) {
        if (!this._isMounted) return;
        var nextLanguage = intendedLanguage || this.state.language;
        this.setState({
          resumeData: data,
          language: nextLanguage,
          localizedLoadError: false,
          pendingLocalizedPath: null,
          pendingLanguage: null,
        });
        document.documentElement.lang = nextLanguage;
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(err);
        if (!this._isMounted) return;
        this.setState({
          localizedLoadError: true,
          pendingLocalizedPath: path,
          pendingLanguage: intendedLanguage || this.state.language,
        });
      }.bind(this),
    });
  }

  loadSharedData() {
    $.ajax({
      url: `${process.env.PUBLIC_URL}/portfolio_shared_data.json`,
      dataType: "json",
      cache: false,
      success: function (data) {
        if (!this._isMounted) return;
        this.setState({ sharedData: data, sharedLoadError: false });
        document.title = `${data.basic_info.name} — Portfolio`;
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(err);
        if (!this._isMounted) return;
        this.setState({ sharedLoadError: true });
      }.bind(this),
    });
  }

  render() {
    const resumeBasicInfo = this.state.resumeData.basic_info;
    const ui = (resumeBasicInfo && resumeBasicInfo.ui) || {};
    const loadErrorCopy = ui.load_error || {};
    const contactEndpoint =
      (this.state.sharedData.basic_info &&
        this.state.sharedData.basic_info.contact_form_endpoint) ||
      "";
    const contactMailto = contactMailtoFromShared(this.state.sharedData);
    const resumeHref =
      this.state.sharedData.basic_info &&
      this.state.sharedData.basic_info.resume_pdf
        ? `${process.env.PUBLIC_URL}/${this.state.sharedData.basic_info.resume_pdf}`
        : "";
    const usableLocalized = hasUsableResumeData(this.state.resumeData);
    const blockingLoadError =
      this.state.sharedLoadError ||
      (this.state.localizedLoadError && !usableLocalized);
    const languageSwitchError =
      this.state.localizedLoadError && usableLocalized;

    if (blockingLoadError) {
      return (
        <ContentLoadError
          variant="page"
          title={loadErrorCopy.title || "Content couldn’t load"}
          body={
            loadErrorCopy.body ||
            "The portfolio content didn’t load. You can try again, or email me directly."
          }
          onRetry={this.retryContentLoad}
          retryLabel={loadErrorCopy.retry || "Try again"}
          contactHref={contactMailto}
          contactLabel={loadErrorCopy.contact || "Email Nicolas"}
        />
      );
    }

    return (
      <AnimateSharedLayout type="crossfade">
        <div className="app-shell">
          <ClickBurst />
          {languageSwitchError ? (
            <ContentLoadError
              variant="banner"
              title={loadErrorCopy.title || "Content couldn’t load"}
              body={
                loadErrorCopy.language_body ||
                "That language couldn’t load. Your current page was left unchanged."
              }
              onRetry={this.retryContentLoad}
              retryLabel={loadErrorCopy.retry || "Try again"}
              contactHref={contactMailto}
              contactLabel={loadErrorCopy.contact || "Email Nicolas"}
            />
          ) : null}
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
            resumeHref={resumeHref}
            positioning={this.state.resumeData.positioning}
            recruiterCta={this.state.resumeData.recruiter_cta}
            onContactClick={this.openContact}
          />
          <CaseStudies
            content={this.state.resumeData.case_studies}
            sectionName={
              resumeBasicInfo &&
              resumeBasicInfo.section_name &&
              resumeBasicInfo.section_name.case_studies
            }
            recruiterCta={this.state.resumeData.recruiter_cta}
            sharedBasicInfo={this.state.sharedData.basic_info}
            resumeHref={resumeHref}
            onContactClick={this.openContact}
            visitLabels={ui}
          />
          <DeliveryCapabilities
            content={this.state.resumeData.delivery_capabilities}
            sectionName={
              resumeBasicInfo &&
              resumeBasicInfo.section_name &&
              resumeBasicInfo.section_name.delivery
            }
          />
          <Projects
            resumeProjects={this.state.resumeData.projects}
            resumeBasicInfo={resumeBasicInfo}
            caseStudyBadge={
              this.state.resumeData.case_studies &&
              this.state.resumeData.case_studies.badge
            }
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
