import React, { Component } from "react";

class ContactModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      status: "idle", // idle | loading | success | error
      errorMessage: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      this.setState({
        name: "",
        email: "",
        status: "idle",
        errorMessage: "",
      });
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

    return (
      <div className="contact-modal" role="dialog" aria-modal="true">
        <button
          type="button"
          className="contact-modal__backdrop"
          aria-label={labels.close || "Close"}
          onClick={this.handleClose}
        />
        <div className="contact-modal__panel">
          <button
            type="button"
            className="contact-modal__close"
            onClick={this.handleClose}
            aria-label={labels.close || "Close"}
          >
            ×
          </button>

          {status === "success" ? (
            <div className="contact-modal__success">
              <h3>{labels.successTitle || "Thank you"}</h3>
              <p>
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
              <h3>{labels.title || "Let’s connect"}</h3>
              <p className="contact-modal__lead">
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
                  disabled={status === "loading"}
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
                  disabled={status === "loading"}
                />
              </label>

              {status === "error" ? (
                <p className="contact-modal__error">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                className="btn btn-primary contact-modal__submit"
                disabled={status === "loading"}
              >
                {status === "loading"
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
