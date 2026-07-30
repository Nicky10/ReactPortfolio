import React, { Component } from "react";
import { motion } from "framer-motion";

class Footer extends Component {
  render() {
    if (this.props.sharedBasicInfo) {
      var networks = this.props.sharedBasicInfo.social.map((network) => {
        if (network.name === "mail" && this.props.onContactClick) {
          return (
            <motion.button
              key={network.name}
              type="button"
              className="footer-social"
              aria-label={network.name}
              onClick={this.props.onContactClick}
              whileHover={{ y: -4, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <i className={network.class}></i>
            </motion.button>
          );
        }
        return (
          <motion.a
            key={network.name}
            href={network.url}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
            aria-label={network.name}
            whileHover={{ y: -4, scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <i className={network.class}></i>
          </motion.a>
        );
      });
    }

    return (
      <footer className="site-footer">
        <div className="container-narrow">
          <motion.p
            className="site-footer__tagline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {this.props.footerTagline ||
              "Open to full-stack roles and product-minded engineering teams."}
          </motion.p>
          <div className="social-links">{networks}</div>
          <small>
            © {new Date().getFullYear()}{" "}
            {this.props.sharedBasicInfo
              ? this.props.sharedBasicInfo.name
              : "Nicolas Delgado"}
          </small>
        </div>
      </footer>
    );
  }
}

export default Footer;
