import React from "react";
import ScrollReveal from "./ScrollReveal";
import SectionAura from "./SectionAura";

export default function DeliveryCapabilities({ content, sectionName }) {
  if (!content) return null;

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

        <ScrollReveal delay={80}>
          <h3 className="delivery-subtitle">{content.approach_title}</h3>
          <ol className="delivery-approach">
            {(content.approach || []).map((item) => (
              <li key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </ScrollReveal>

        <div id="capability-map">
          <ScrollReveal delay={120}>
            <h3 className="delivery-subtitle">{content.systems_title}</h3>
            <div className="capability-map">
              {(content.systems || []).map((group) => (
                <div key={group.id} className="capability-map__group">
                  <h4>{group.title}</h4>
                  <ul>
                    {(group.entries || []).map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={160}>
          <h3 className="delivery-subtitle">{content.production_title}</h3>
          <ul className="delivery-production">
            {(content.production || []).map((item) => (
              <li key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
