import React from "react";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ImpactSnapshot({ content }) {
  if (!content || !content.metrics || !content.metrics.length) return null;

  return (
    <section className="impact-snapshot" aria-labelledby="impact-snapshot-title">
      <p className="evidence-eyebrow">{content.eyebrow}</p>
      <h3 id="impact-snapshot-title" className="evidence-title">
        {content.title}
      </h3>
      <ul className="impact-snapshot__grid">
        {content.metrics.map((metric) => (
          <li key={metric.id}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RolePathNavigator({ content }) {
  if (!content || !content.paths || !content.paths.length) return null;

  return (
    <section className="role-paths" aria-labelledby="role-paths-title">
      <p className="evidence-eyebrow">{content.eyebrow}</p>
      <h3 id="role-paths-title" className="evidence-title">
        {content.title}
      </h3>
      {content.lead ? <p className="evidence-lead">{content.lead}</p> : null}
      <div className="role-paths__grid">
        {content.paths.map((path) => (
          <button
            key={path.id}
            type="button"
            className="role-paths__card"
            onClick={() => scrollToId(path.target)}
          >
            <h4>{path.title}</h4>
            <p>{path.description}</p>
            <span className="role-paths__cta">
              {path.cta}
              <i className="fas fa-arrow-down" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function PositioningBlock({ positioning, recruiterCta, sharedBasicInfo, resumeHref, onContactClick }) {
  if (!positioning) return null;

  return (
    <div className="positioning-block">
      <ImpactSnapshot content={positioning.impact} />
      <RolePathNavigator content={positioning.role_paths} />
      {recruiterCta ? (
        <RecruiterCallToAction
          content={recruiterCta}
          sharedBasicInfo={sharedBasicInfo}
          resumeHref={resumeHref}
          onContactClick={onContactClick}
          headingId="recruiter-cta-positioning"
        />
      ) : null}
    </div>
  );
}

export function RecruiterCallToAction({
  content,
  sharedBasicInfo,
  resumeHref,
  onContactClick,
  headingId = "recruiter-cta-title",
}) {
  if (!content) return null;

  const social = (sharedBasicInfo && sharedBasicInfo.social) || [];
  const linkedin = social.find((item) => /linked/i.test(item.name || ""));
  const github = social.find((item) => /github/i.test(item.name || ""));

  return (
    <aside className="recruiter-cta" aria-labelledby={headingId}>
      <p className="recruiter-cta__focus">{content.hiring_focus}</p>
      <h3 id={headingId}>{content.title}</h3>
      {content.lead ? <p className="recruiter-cta__lead">{content.lead}</p> : null}
      {content.availability ? (
        <p className="recruiter-cta__availability">{content.availability}</p>
      ) : null}
      <div className="recruiter-cta__routes">
        {resumeHref ? (
          <a
            className="btn btn-primary"
            href={resumeHref}
            download="Resume_Nicolas_Delgado.pdf"
          >
            {content.resume || "Resume"}
          </a>
        ) : null}
        {onContactClick ? (
          <button type="button" className="btn recruiter-cta__contact" onClick={onContactClick}>
            {content.contact || "Contact"}
          </button>
        ) : null}
        {linkedin && linkedin.url ? (
          <a
            className="btn recruiter-cta__ghost"
            href={linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.linkedin || "LinkedIn"}
          </a>
        ) : null}
        {github && github.url ? (
          <a
            className="btn recruiter-cta__ghost"
            href={github.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.github || "GitHub"}
          </a>
        ) : null}
      </div>
    </aside>
  );
}
