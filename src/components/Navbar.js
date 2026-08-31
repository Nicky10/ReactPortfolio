import React, { Component } from "react";
import { FloatingNavControls } from "./SiteControls";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { scrolled: false, open: false };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const scrolled = window.scrollY > 40;
    if (scrolled !== this.state.scrolled) {
      this.setState({ scrolled });
    }
  }

  scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    this.setState({ open: false });
  }

  render() {
    const nav = this.props.navLabels || {};
    const links = [
      { id: "about", label: nav.about || "About" },
      { id: "delivery-capabilities", label: nav.delivery || "Delivery" },
      { id: "portfolio", label: nav.work || "Work" },
      { id: "skills", label: nav.skills || "Skills" },
      { id: "certificates", label: nav.certs || "Certs" },
      { id: "resume", label: nav.experience || "Experience" },
    ];

    const name =
      this.props.sharedBasicInfo && this.props.sharedBasicInfo.name
        ? this.props.sharedBasicInfo.name.split(" ")[0]
        : "Nicolas";

    const social =
      (this.props.sharedBasicInfo && this.props.sharedBasicInfo.social) || [];
    const github =
      social.find((item) => item.name === "github") || {
        url: "https://github.com/Nicky10",
        class: "fab fa-github",
      };

    const showControls = this.props.controlsPinned;

    return (
      <nav
        className={`site-nav ${this.state.scrolled ? "site-nav--scrolled" : ""} ${
          showControls ? "site-nav--with-controls" : ""
        }`}
      >
        <div className="site-nav__inner">
          <div className="site-nav__brand-wrap">
            <button
              type="button"
              className="site-nav__brand"
              onClick={() => this.scrollTo("home")}
            >
              {name}
              <span className="site-nav__brand-dot">.</span>
            </button>
            <a
              className="site-nav__github"
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              title="GitHub"
            >
              <i className={github.class || "fab fa-github"} aria-hidden="true" />
            </a>
          </div>

          {showControls ? (
            <FloatingNavControls
              isDark={this.props.isDark}
              onThemeChange={this.props.onThemeChange}
              language={this.props.language}
              onLanguageChange={this.props.onLanguageChange}
            />
          ) : null}

          <button
            type="button"
            className="site-nav__toggle"
            aria-label="Toggle menu"
            onClick={() => this.setState({ open: !this.state.open })}
          >
            <span />
            <span />
          </button>

          <ul className={`site-nav__links ${this.state.open ? "is-open" : ""}`}>
            {links.map((link) => (
              <li key={link.id}>
                <button type="button" onClick={() => this.scrollTo(link.id)}>
                  {link.label}
                </button>
              </li>
            ))}
            {this.props.resumeHref ? (
              <li>
                <a
                  className="site-nav__resume"
                  href={this.props.resumeHref}
                  download="Resume_Nicolas_Delgado.pdf"
                  onClick={() => this.setState({ open: false })}
                >
                  <i className="fas fa-download" aria-hidden="true"></i>
                  {nav.resume || "Resume"}
                </a>
              </li>
            ) : null}
            <li>
              <button
                type="button"
                className="site-nav__cta"
                onClick={() => {
                  this.setState({ open: false });
                  if (this.props.onContactClick) this.props.onContactClick();
                }}
              >
                {nav.contact || "Contact"}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
