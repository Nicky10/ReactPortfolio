import React from "react";
import ScrollReveal from "./ScrollReveal";

export default function ProjectImpactMetrics({ metrics, reveal = false, delay = 0 }) {
  if (!metrics || !metrics.length) return null;

  const list = (
    <ul className="project-impact-metrics">
      {metrics.map((metric) => (
        <li key={metric.id || metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </li>
      ))}
    </ul>
  );

  if (!reveal) return list;

  return (
    <ScrollReveal delay={delay} className="project-impact-metrics-wrap">
      {list}
    </ScrollReveal>
  );
}
