import React from "react";
import { render } from "@testing-library/react";
import Skills from "./Skills";
import { projectsForSkill } from "./skillProjects";

const projects = [
  {
    title: "Immiland Sign",
    url: "https://example.run.app/",
    description: "Production e-signature platform.",
    technologies: [{ name: "Next.js" }, { name: "NestJS" }, { name: "TypeScript" }],
    tech_stack: {
      frontend: ["Next.js", "TypeScript"],
      backend: ["NestJS"],
      storage: ["Amazon S3"],
      integrations: ["Stripe"],
    },
  },
  {
    title: "PIE Placement Exam Platform",
    description:
      "FastAPI linguistic-AI scoring with DELF/CEFR rubrics and explicit four-skill rules.",
    technologies: [
      { name: "React" },
      { name: "Python" },
      { name: "FastAPI" },
      { name: "NLP" },
    ],
    tech_stack: {
      frontend: ["React"],
      backend: ["Python", "FastAPI"],
      scoring: ["CEFR/DELF rubrics", "Rule-based NLP", "Adaptive difficulty"],
    },
  },
  {
    title: "Cinerama",
    description: "Cinema booking with Express.js, React, and MongoDB.",
    technologies: [{ name: "React" }, { name: "Express" }, { name: "MongoDB" }],
    tech_stack: { frontend: ["React"], backend: ["Express"], database: ["MongoDB"] },
  },
];

it("maps published skills to the projects that use them", () => {
  expect(projectsForSkill("TypeScript", projects)).toEqual(["Immiland Sign"]);
  expect(projectsForSkill("Stripe", projects)).toEqual(["Immiland Sign"]);
  expect(projectsForSkill("AWS", projects)).toEqual(["Immiland Sign"]);
  expect(projectsForSkill("NLP", projects)).toEqual([
    "PIE Placement Exam Platform",
  ]);
  expect(projectsForSkill("scikit-learn", projects)).toEqual([]);
  expect(projectsForSkill("MongoDB", projects)).toEqual(["Cinerama"]);
  expect(projectsForSkill("Git", projects)).toEqual([
    "Immiland Sign",
    "PIE Placement Exam Platform",
    "Cinerama",
  ]);
  expect(projectsForSkill("Linux", projects)).toEqual([
    "Immiland Sign",
    "PIE Placement Exam Platform",
    "Cinerama",
  ]);
});

it("shows related project titles in each skill tooltip", () => {
  const { getByText } = render(
    <Skills
      sharedSkills={{
        icons: [
          { name: "TypeScript", class: "devicon-typescript-plain" },
          { name: "Git", class: "devicon-git-plain" },
          { name: "scikit-learn", class: "devicon-sklearn-plain" },
        ],
      }}
      resumeBasicInfo={{
        section_name: { skills: "Skills" },
        ui: {
          skills_used_in: "Used in",
          skills_unused: "Not listed on a published project",
        },
      }}
      resumeProjects={projects}
    />
  );

  const typescript = getByText("TypeScript").closest("li");
  expect(typescript).toHaveTextContent("Used in");
  expect(typescript).toHaveTextContent("Immiland Sign");

  const git = getByText("Git").closest("li");
  expect(git).toHaveTextContent("Used in");
  expect(git).toHaveTextContent("Immiland Sign");
  expect(git).toHaveTextContent("PIE Placement Exam Platform");
  expect(git).toHaveTextContent("Cinerama");

  const sklearn = getByText("scikit-learn").closest("li");
  expect(sklearn).toHaveTextContent("Not listed on a published project");
});
