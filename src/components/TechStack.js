import React from "react";

const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "scoring",
  "storage",
  "database",
  "integrations",
];

export function populatedStackGroups(stack, labels = {}) {
  if (!stack) return [];
  return CATEGORY_ORDER.filter(
    (key) => Array.isArray(stack[key]) && stack[key].length
  ).map((key) => ({
    key,
    label: labels[key] || key,
    items: stack[key],
  }));
}

export default function TechStack({ stack, labels = {}, compact = false }) {
  const groups = populatedStackGroups(stack, labels);
  if (!groups.length) return null;

  return (
    <div
      className={`tech-stack ${compact ? "tech-stack--compact" : ""}`.trim()}
    >
      {groups.map((group) => (
        <div key={group.key} className="tech-stack__group">
          <h4>{group.label}</h4>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
