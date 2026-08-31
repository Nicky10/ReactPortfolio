import React, { Component } from "react";
import { motion } from "framer-motion";

function prefersReducedMotion() {
  return Boolean(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

class ScrollReveal extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    const reduced = prefersReducedMotion();
    this.state = { visible: reduced, reduced };
  }

  componentDidMount() {
    if (this.state.reduced) return;

    const node = this.ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      this.setState({ visible: true });
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.setState({ visible: entry.isIntersecting });
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
    const { visible, reduced } = this.state;

    return (
      <motion.div
        ref={this.ref}
        className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
        initial={reduced ? false : { opacity: 0, y: 28 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                delay: visible ? delay / 1000 : 0,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }
        }
      >
        {children}
      </motion.div>
    );
  }
}

export default ScrollReveal;
