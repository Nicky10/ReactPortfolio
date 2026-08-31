function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[._]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const ALIASES = {
  javascript: ["javascript", "react", "next.js"],
  "node.js": ["node.js", "express", "nestjs"],
  aws: ["aws", "amazon s3", "s3"],
  "google cloud": ["google cloud", "cloud run", "run.app"],
  "google apis": ["google apis", "google calendar", "google sheets"],
  "apps script": ["apps script"],
  "scikit-learn": ["scikit-learn", "sklearn"],
  nlp: ["nlp", "linguistic", "cefr", "delf"],
  "react query": ["react query"],
  docker: ["docker", "run.app"],
};

const TRANSVERSAL = new Set(["git", "linux"]);

function projectSearchText(project) {
  const parts = [];
  (project.technologies || []).forEach(function (item) {
    parts.push(item && item.name);
  });
  const stack = project.tech_stack || {};
  Object.keys(stack).forEach(function (key) {
    const entries = stack[key];
    if (Array.isArray(entries)) parts.push.apply(parts, entries);
  });
  const detail = project.impact_detail || {};
  if (Array.isArray(detail.technologies)) {
    parts.push.apply(parts, detail.technologies);
  }
  if (Array.isArray(detail.integrations)) {
    parts.push.apply(parts, detail.integrations);
  }
  parts.push(project.description);
  parts.push(project.url);
  return normalize(parts.filter(Boolean).join(" | "));
}

function skillNeedles(skillName) {
  const key = normalize(skillName);
  const aliases = ALIASES[key] || [skillName];
  return aliases.map(normalize).filter(Boolean);
}

function projectTitles(projects) {
  return (projects || []).map(function (project) {
    return project.title;
  });
}

export function projectsForSkill(skillName, projects) {
  if (TRANSVERSAL.has(normalize(skillName))) {
    return projectTitles(projects);
  }

  const needles = skillNeedles(skillName);
  return (projects || [])
    .filter(function (project) {
      const haystack = projectSearchText(project);
      return needles.some(function (needle) {
        return needle && haystack.indexOf(needle) !== -1;
      });
    })
    .map(function (project) {
      return project.title;
    });
}
