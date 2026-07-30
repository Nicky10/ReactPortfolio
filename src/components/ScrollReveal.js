import React, { Component } from "react";
import { motion } from "framer-motion";

class ScrollReveal extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = { visible: false };
  }

  componentDidMount() {
    const node = this.ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      this.setState({ visible: true });
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      this.setState({ visible: true });
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.setState({ visible: true });
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    this.observer.observe(node);
  }

  componentWillUnmount() {
    if (this.observer && this.ref.current) {
      this.observer.unobserve(this.ref.current);
    }
  }

  render() {
    const { children, className = "", delay = 0 } = this.props;
    const visible = this.state.visible;

    return (
      <motion.div
        ref={this.ref}
        className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
        initial={{ opacity: 0, y: 28 }}
        animate={
          visible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 28 }
        }
        transition={{
          delay: delay / 1000,
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    );
  }
}

export default ScrollReveal;
