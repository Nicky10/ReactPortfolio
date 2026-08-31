import React from "react";
import ScrollReveal from "./ScrollReveal";
import SectionAura from "./SectionAura";

const APPROACH_ICONS = {
  discovery: "fas fa-comments",
  "system-api": "fas fa-sitemap",
  "full-stack": "fas fa-layer-group",
  integrations: "fas fa-plug",
  "production-support": "fas fa-heartbeat",
};

const SYSTEM_ICONS = {
  payments: "fas fa-credit-card",
  apis: "fas fa-code-branch",
  scheduling: "fas fa-calendar-check",
  data: "fas fa-database",
  platforms: "fas fa-cloud",
};

const PRODUCTION_ICONS = {
  containers: "fas fa-box",
  checks: "fas fa-vial",
  health: "fas fa-notes-medical",
  monitoring: "fas fa-chart-line",
  troubleshooting: "fas fa-stethoscope",
};

function groupIcon(map, id, fallback) {
  return map[id] || fallback;
}

export default function DeliveryCapabilities({ content, sectionName }) {
  if (!content) return null;

  const approach = content.approach || [];
  const systems = content.systems || [];
  const production = content.production || [];

  return (
    <section id="delivery-capabilities" className="section delivery-section">
      <SectionAura variant="skills" />
      <div className="container-narrow">
        <ScrollReveal>
          <h2 className="section-heading section-heading--light">
            <span className="section-heading__index">03</span>
            {sectionName || "Delivery & integrations"}
          </h2>
          <p className="section-lead section-lead--light">{content.lead}</p>
        </ScrollReveal>

        <h3 className="delivery-subtitle">{content.approach_title}</h3>
        <div className="delivery-approach">
          {approach.map((item, index) => (
            <ScrollReveal key={item.id || item.title} delay={index * 70}>
              <article className="delivery-card">
                <span className="delivery-card__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="delivery-card__icon" aria-hidden="true">
                  <i
                    className={groupIcon(
                      APPROACH_ICONS,
                      item.id,
                      "fas fa-circle"
                    )}
                  />
                </span>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div id="capability-map">
          <ScrollReveal>
            <h3 className="delivery-subtitle">{content.systems_title}</h3>
          </ScrollReveal>
          <div className="capability-map">
            {systems.map((group, index) => (
              <ScrollReveal key={group.id} delay={index * 70}>
                <article className="capability-map__group">
                  <span className="capability-map__icon" aria-hidden="true">
                    <i
                      className={groupIcon(
                        SYSTEM_ICONS,
                        group.id,
                        "fas fa-circle"
                      )}
                    />
                  </span>
                  <h4>{group.title}</h4>
                  <ul>
                    {(group.entries || []).map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <h3 className="delivery-subtitle">{content.production_title}</h3>
        <div className="delivery-production">
          {production.map((item, index) => (
            <ScrollReveal key={item.id || item.title} delay={index * 70}>
              <article className="delivery-card delivery-card--production">
                <span className="delivery-card__icon" aria-hidden="true">
                  <i
                    className={groupIcon(
                      PRODUCTION_ICONS,
                      item.id,
                      "fas fa-circle"
                    )}
                  />
                </span>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
