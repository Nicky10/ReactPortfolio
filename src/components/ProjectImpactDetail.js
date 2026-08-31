import React from "react";

export default function ProjectImpactDetail({
  detail,
  labels = {},
  hideOutcomes = false,
  hideTechnologies = false,
  hideIntegrations = false,
}) {
  if (!detail) return null;

  const problem = labels.problem || "Business problem";
  const ownership = labels.ownership || "Ownership";
  const delivery = labels.delivery || "Delivered capability";
  const technologies = labels.technologies || "Technologies";
  const integrations = labels.integrations || "Integrations";
  const outcomes = labels.outcomes || "Verified outcomes";

  return (
    <div className="project-impact-detail">
      {detail.problem ? (
        <>
          <h4>{problem}</h4>
          <p>{detail.problem}</p>
        </>
      ) : null}
      {detail.ownership ? (
        <>
          <h4>{ownership}</h4>
          <p>{detail.ownership}</p>
        </>
      ) : null}
      {detail.delivery ? (
        <>
          <h4>{delivery}</h4>
          <p>{detail.delivery}</p>
        </>
      ) : null}
      {!hideTechnologies && detail.technologies && detail.technologies.length ? (
        <>
          <h4>{technologies}</h4>
          <ul className="project-impact-detail__chips">
            {detail.technologies.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}
      {!hideIntegrations && detail.integrations && detail.integrations.length ? (
        <>
          <h4>{integrations}</h4>
          <ul className="project-impact-detail__chips">
            {detail.integrations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}
      {!hideOutcomes && detail.outcomes && detail.outcomes.length ? (
        <>
          <h4>{outcomes}</h4>
          <ul className="project-impact-detail__outcomes">
            {detail.outcomes.map((outcome) => (
              <li key={outcome.label}>
                <strong>{outcome.value}</strong>
                <span>{outcome.label}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
