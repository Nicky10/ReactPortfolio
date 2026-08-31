import React from "react";

function ContentLoadError({
  variant = "page",
  title,
  body,
  onRetry,
  retryLabel,
  contactHref,
  contactLabel,
}) {
  const isBanner = variant === "banner";

  const Heading = isBanner ? "h2" : "h1";

  return (
    <div
      className={
        isBanner
          ? "content-load-error content-load-error--banner"
          : "content-load-error"
      }
      role="alert"
      aria-live="assertive"
    >
      <div className="content-load-error__panel">
        <Heading className="content-load-error__title">{title}</Heading>
        <p className="content-load-error__body">{body}</p>
        <div className="content-load-error__actions">
          {onRetry ? (
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              {retryLabel || "Try again"}
            </button>
          ) : null}
          {contactHref ? (
            <a className="btn content-load-error__contact" href={contactHref}>
              {contactLabel || "Email Nicolas"}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ContentLoadError;
