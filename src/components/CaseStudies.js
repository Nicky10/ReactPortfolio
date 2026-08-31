import React, { useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import MotionCard from "./MotionCard";
import SectionAura from "./SectionAura";
import { RecruiterCallToAction } from "./Positioning";

function CaseStudyDetail({ study, labels, visitLabels, onClose }) {
  if (!study) return null;

  const isCorporate = study.access === "corporate";
  const canVisit = Boolean(study.url) && !isCorporate;
  const visitLive = (visitLabels && visitLabels.visit_live) || "Visit live platform";

  return (
    <CaseStudyDetailBody
      study={study}
      labels={labels}
      visitLabels={visitLabels}
      isCorporate={isCorporate}
      canVisit={canVisit}
      visitLive={visitLive}
      onClose={onClose}
    />
  );
}

function CaseStudyDetailBody({
  study,
  labels,
  visitLabels,
  isCorporate,
  canVisit,
  visitLive,
  onClose,
}) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="case-study-modal" role="presentation">
      <button
        type="button"
        className="case-study-modal__backdrop"
        aria-label={visitLabels && visitLabels.close ? visitLabels.close : "Close"}
        onClick={onClose}
      />
      <div
        className="case-study-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
      >
        <button
          type="button"
          className="case-study-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {study.image ? (
          <img
            className="case-study-modal__image"
            src={`${process.env.PUBLIC_URL}/${study.image}`}
            alt=""
          />
        ) : null}
        <h3 id="case-study-title">{study.title}</h3>
        {isCorporate && study.availability_note ? (
          <p className="case-study-modal__note" role="note">
            {study.availability_note}
          </p>
        ) : null}
        {canVisit ? (
          <a
            className="btn btn-primary case-study-modal__visit"
            href={study.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {visitLive}
          </a>
        ) : null}

        <dl className="case-study-modal__dl">
          <dt>{labels.problem}</dt>
          <dd>{study.problem}</dd>
          <dt>{labels.ownership}</dt>
          <dd>{study.ownership}</dd>
          <dt>{labels.delivery}</dt>
          <dd>{study.delivery}</dd>
          {study.technologies && study.technologies.length ? (
            <>
              <dt>{labels.technologies}</dt>
              <dd>
                <ul className="case-study-modal__chips">
                  {study.technologies.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </>
          ) : null}
          {study.integrations && study.integrations.length ? (
            <>
              <dt>{labels.integrations}</dt>
              <dd>
                <ul className="case-study-modal__chips">
                  {study.integrations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </>
          ) : null}
          {study.outcomes && study.outcomes.length ? (
            <>
              <dt>{labels.outcomes}</dt>
              <dd>
                <ul className="case-study-modal__outcomes">
                  {study.outcomes.map((outcome) => (
                    <li key={outcome.label}>
                      <strong>{outcome.value}</strong>
                      <span>{outcome.label}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          ) : null}
        </dl>
      </div>
    </div>
  );
}

export default function CaseStudies({
  content,
  sectionName,
  recruiterCta,
  sharedBasicInfo,
  resumeHref,
  onContactClick,
  visitLabels,
}) {
  const [selected, setSelected] = useState(null);
  if (!content || !content.items || !content.items.length) return null;

  const items = content.items;
  const labels = content.labels || {};

  return (
    <section id="case-studies" className="section case-studies-section">
      <SectionAura variant="projects" />
      <div className="container-narrow">
        <ScrollReveal>
          <h2 className="section-heading">
            <span className="section-heading__index">02</span>
            {sectionName || "Selected case studies"}
          </h2>
          <p className="section-lead">{content.lead}</p>
        </ScrollReveal>

        <div className="case-studies__grid">
          {items.map((study, index) => (
            <ScrollReveal key={study.id} delay={index * 60}>
              <MotionCard
                className="case-study-card"
                onClick={() => setSelected(study)}
              >
                <div className="case-study-card__media">
                  <img
                    src={`${process.env.PUBLIC_URL}/${study.image}`}
                    alt=""
                  />
                  <span className="case-study-card__badge">{content.badge}</span>
                </div>
                <div className="case-study-card__body">
                  <h3>{study.title}</h3>
                  <p>{study.problem}</p>
                  {study.outcomes && study.outcomes[0] ? (
                    <p className="case-study-card__metric">
                      <strong>{study.outcomes[0].value}</strong>
                      <span>{study.outcomes[0].label}</span>
                    </p>
                  ) : null}
                  <span className="case-study-card__more">
                    {content.open}
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                  </span>
                </div>
              </MotionCard>
            </ScrollReveal>
          ))}
        </div>

        <div id="recruiter-cta-after-cases">
          <RecruiterCallToAction
            content={recruiterCta}
            sharedBasicInfo={sharedBasicInfo}
            resumeHref={resumeHref}
            onContactClick={onContactClick}
            headingId="recruiter-cta-after-cases-title"
          />
        </div>
      </div>

      {selected ? (
        <CaseStudyDetail
          study={selected}
          labels={labels}
          visitLabels={visitLabels}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </section>
  );
}
