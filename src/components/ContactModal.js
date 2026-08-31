import React, { Component } from "react";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "a[href]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

class ContactModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      status: "idle", // idle | loading | success | error
      errorMessage: "",
    };
    this.panelRef = React.createRef();
    this.previouslyFocused = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocusIn = this.handleFocusIn.bind(this);
  }

  componentDidMount() {
    if (this.props.show) {
      this.previouslyFocused =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      this.attachDialogListeners();
      this.focusInitial();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.show && !prevProps.show) {
      this.previouslyFocused =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      this.setState(
        {
          name: "",
          email: "",
          status: "idle",
          errorMessage: "",
        },
        () => this.focusInitial()
      );
      this.attachDialogListeners();
      return;
    }

    if (!this.props.show && prevProps.show) {
      this.detachDialogListeners();
      this.restoreTriggerFocus();
      return;
    }

    if (
      this.props.show &&
      this.state.status === "success" &&
      prevState.status !== "success"
    ) {
      this.focusInitial();
    }
  }

  componentWillUnmount() {
    this.detachDialogListeners();
  }

  attachDialogListeners() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("focusin", this.handleFocusIn);
  }

  detachDialogListeners() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("focusin", this.handleFocusIn);
  }

  restoreTriggerFocus() {
    const trigger = this.previouslyFocused;
    this.previouslyFocused = null;
    if (trigger && typeof trigger.focus === "function" && document.contains(trigger)) {
      trigger.focus();
    }
  }

  getFocusableElements() {
    const panel = this.panelRef.current;
    if (!panel) return [];
    return Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (el) => el.tabIndex !== -1 && !el.hasAttribute("disabled")
    );
  }

  focusInitial() {
    const panel = this.panelRef.current;
    if (!panel) return;
    const preferred = panel.querySelector("input:not([disabled])");
    const target = preferred || this.getFocusableElements()[0];
    if (target) target.focus();
  }

  handleFocusIn(event) {
    if (!this.props.show) return;
    const panel = this.panelRef.current;
    if (!panel || panel.contains(event.target)) return;
    const focusable = this.getFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    }
  }

  handleKeyDown(event) {
    if (!this.props.show) return;

    if (event.key === "Escape") {
      if (this.state.status === "loading") return;
      event.preventDefault();
      this.handleClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = this.getFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !this.panelRef.current.contains(active))) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && (active === last || !this.panelRef.current.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClose() {
    if (this.state.status === "loading") return;
    this.props.onHide();
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, email } = this.state;
    const endpoint = this.props.endpoint;
    const labels = this.props.labels || {};

    if (!name.trim() || !email.trim()) {
      this.setState({
        status: "error",
        errorMessage: labels.required || "Please fill in all fields.",
      });
      return;
    }

    if (!endpoint) {
      this.setState({
        status: "error",
        errorMessage:
          labels.missingEndpoint ||
          "Contact form is not configured yet. Please email me directly.",
      });
      return;
    }

    this.setState({ status: "loading", errorMessage: "" });

    // text/plain avoids CORS preflight with Apps Script web apps
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        language: this.props.language || "en",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.ok) {
          this.setState({ status: "success" });
          return;
        }
        throw new Error((data && data.error) || "Request failed");
      })
      .catch(() => {
        this.setState({
          status: "error",
          errorMessage:
            labels.error ||
            "Something went wrong. Please try again or email me directly.",
        });
      });
  }

  render() {
    if (!this.props.show) return null;

    const labels = this.props.labels || {};
    const { name, email, status, errorMessage } = this.state;
    const isSubmitting = status === "loading";

    return (
      <div className="contact-modal" role="presentation">
        <button
          type="button"
          className="contact-modal__backdrop"
          aria-label={labels.close || "Close"}
          tabIndex={-1}
          disabled={isSubmitting}
          onClick={this.handleClose}
        />
        <div
          className="contact-modal__panel"
          ref={this.panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          aria-describedby="contact-modal-desc"
        >
          <button
            type="button"
            className="contact-modal__close"
            onClick={this.handleClose}
            aria-label={labels.close || "Close"}
            disabled={isSubmitting}
          >
            ×
          </button>

          {status === "success" ? (
            <div className="contact-modal__success">
              <h3 id="contact-modal-title">{labels.successTitle || "Thank you"}</h3>
              <p id="contact-modal-desc">
                {labels.successBody ||
                  "I just sent you an email with my contact details. Feel free to reply anytime."}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleClose}
              >
                {labels.done || "Done"}
              </button>
            </div>
          ) : (
            <form className="contact-modal__form" onSubmit={this.handleSubmit}>
              <h3 id="contact-modal-title">{labels.title || "Let’s connect"}</h3>
              <p className="contact-modal__lead" id="contact-modal-desc">
                {labels.lead ||
                  "Share your name and email and I’ll reach out with my contact details."}
              </p>

              <label className="contact-modal__field">
                <span>{labels.name || "Name"}</span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  autoComplete="name"
                  required
                  disabled={isSubmitting}
                />
              </label>

              <label className="contact-modal__field">
                <span>{labels.email || "Email"}</span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                />
              </label>

              {status === "error" ? (
                <p className="contact-modal__error" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="btn btn-primary contact-modal__submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting
                  ? labels.sending || "Sending…"
                  : labels.submit || "Send"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default ContactModal;
