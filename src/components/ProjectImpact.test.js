import React from "react";
import { render, act } from "@testing-library/react";
import Projects from "./Projects";
import ProjectDetailsModal from "./ProjectDetailsModal";
import ProjectImpactMetrics from "./ProjectImpactMetrics";
import DeliveryCapabilities from "./DeliveryCapabilities";
import ScrollReveal from "./ScrollReveal";
import TechStack from "./TechStack";

const basicInfo = {
  section_name: { projects: "Featured work" },
  ui: {
    featured: "Featured",
    project_details: "View details",
    visit_live: "Visit live platform",
    visit_corporate_note:
      "Corporate login required — public access is not available.",
    project_impact: {
      problem: "Business problem",
      ownership: "Ownership",
      delivery: "Delivered capability",
      technologies: "Technologies",
      integrations: "Integrations",
      outcomes: "Verified outcomes",
    },
    tech_stack: {
      frontend: "Frontend",
      backend: "Backend",
      scoring: "Scoring / AI",
      storage: "Storage",
      database: "Database",
      integrations: "External integrations",
    },
  },
};

const signProject = {
  title: "Immiland Sign",
  startDate: "2025–2026",
  featured: true,
  description: "Production e-signature platform.",
  images: ["images/portfolio/immiland-sign/immiland-sign.png"],
  url: "https://example.invalid/sign",
  access: "corporate",
  technologies: [{ class: "devicon-nextjs-plain", name: "Next.js" }],
  tech_stack: {
    frontend: ["Next.js", "TypeScript"],
    backend: ["NestJS"],
    storage: ["Amazon S3"],
    database: ["PostgreSQL"],
    integrations: ["Stripe"],
  },
  impact_metrics: [
    { id: "sign_savings", value: "~$20K", label: "annual operating cost savings" },
    {
      id: "sign_productivity",
      value: "35%",
      label: "document-processing productivity improvement",
    },
  ],
  impact_detail: {
    sanitized: true,
    problem: "Need a lower-cost signing path.",
    ownership: "Primary author.",
    delivery: "Production e-signature product.",
    technologies: ["Next.js"],
    integrations: ["Stripe"],
    outcomes: [
      { value: "~$20K", label: "annual operating cost savings" },
      { value: "35%", label: "document-processing productivity improvement" },
    ],
    availability_note:
      "Corporate login required — public access is not available.",
  },
};

const pieProject = {
  title: "PIE Placement Exam Platform",
  startDate: "2025",
  featured: true,
  description: "Language placement exams.",
  images: ["images/portfolio/pie-placement/pie-placement-test.png"],
  url: "https://app.planetaimmilandeducation.com/",
  technologies: [{ class: "devicon-react-plain", name: "React" }],
  impact_metrics: [{ id: "pie_users", value: "100+", label: "users per week" }],
  impact_detail: {
    problem: "Need automated placement.",
    ownership: "Built the platform.",
    delivery: "Placement product.",
    technologies: ["React"],
    integrations: ["FastAPI scoring service"],
    outcomes: [{ value: "100+", label: "users per week" }],
  },
};

const flowProject = {
  title: "Immiland Flow — Client Purchases",
  startDate: "2024–2025",
  featured: false,
  description: "Client checkout.",
  images: ["images/portfolio/flow/flow-english.png"],
  url: "https://flow.immiland.app/example",
  technologies: [{ class: "fab fa-stripe", name: "Stripe" }],
  impact_metrics: [
    {
      id: "payment_revenue",
      value: "$10K+",
      label: "additional monthly revenue from payment workflows",
    },
  ],
};

const otherProject = {
  title: "CRS Calculator & Dashboard",
  startDate: "2025",
  featured: false,
  description: "CRS scoring tool.",
  images: ["images/portfolio/crsCalculator/crs1.png"],
  url: "https://en.immilandcanada.com/calculadora-crs",
  technologies: [{ class: "devicon-react-plain", name: "React" }],
};

it("shows verified metrics with their projects and omits empty impact areas", () => {
  const { getByText, queryByText, container } = render(
    <Projects
      resumeProjects={[signProject, pieProject, flowProject, otherProject]}
      resumeBasicInfo={basicInfo}
    />
  );

  expect(getByText("100+")).toBeInTheDocument();
  expect(getByText("users per week")).toBeInTheDocument();
  expect(getByText("~$20K")).toBeInTheDocument();
  expect(getByText("35%")).toBeInTheDocument();
  expect(getByText("$10K+")).toBeInTheDocument();
  expect(
    getByText("additional monthly revenue from payment workflows")
  ).toBeInTheDocument();
  expect(queryByText("Outcomes recruiters can check")).not.toBeInTheDocument();
  expect(queryByText("Selected case studies")).not.toBeInTheDocument();
  expect(container.querySelectorAll(".project-impact-metrics").length).toBe(3);
});

it("does not render an impact area when a project has no approved metrics", () => {
  const { container, queryByRole } = render(
    <ProjectImpactMetrics metrics={[]} />
  );
  expect(container.querySelector(".project-impact-metrics")).toBeNull();
  expect(queryByRole("list")).not.toBeInTheDocument();
});

it("opens Sign details in the project modal without a public live CTA", () => {
  const { getByText, getByRole, queryByRole } = render(
    <ProjectDetailsModal
      show
      onHide={() => {}}
      data={signProject}
      visitLabels={basicInfo.ui}
      impactLabels={basicInfo.ui.project_impact}
    />
  );

  expect(getByText("Need a lower-cost signing path.")).toBeInTheDocument();
  expect(getByText("Primary author.")).toBeInTheDocument();
  expect(
    getByText("Corporate login required — public access is not available.")
  ).toBeInTheDocument();
  expect(getByRole("note").textContent).toMatch(/Corporate login required/);
  expect(queryByRole("link", { name: "Visit live platform" })).not.toBeInTheDocument();
  expect(getByText("annual operating cost savings")).toBeInTheDocument();
});

it("opens PIE details in the project modal with weekly-user evidence", () => {
  const { getByText, getByRole } = render(
    <ProjectDetailsModal
      show
      onHide={() => {}}
      data={pieProject}
      visitLabels={basicInfo.ui}
      impactLabels={basicInfo.ui.project_impact}
    />
  );

  expect(getByText("Need automated placement.")).toBeInTheDocument();
  expect(getByText("FastAPI scoring service")).toBeInTheDocument();
  expect(getByText("100+")).toBeInTheDocument();
  expect(getByRole("link", { name: "Visit live platform" })).toHaveAttribute(
    "href",
    "https://app.planetaimmilandeducation.com/"
  );
});

it("renders designed delivery, systems, and production groups", () => {
  const content = {
    lead: "How work is delivered",
    approach_title: "Delivery approach",
    approach: [
      { id: "discovery", title: "Product discovery with stakeholders", body: "Clarify requirements." },
      { id: "system-api", title: "System and API design", body: "Design contracts." },
      { id: "full-stack", title: "Full-stack delivery", body: "Ship features." },
      { id: "integrations", title: "Integrations and automation", body: "Connect systems." },
      { id: "production-support", title: "Production support", body: "Operate after release." },
    ],
    systems_title: "Systems and integrations",
    systems: [
      { id: "payments", title: "Payments", entries: ["Stripe"] },
      { id: "apis", title: "APIs and webhooks", entries: ["REST APIs"] },
      { id: "scheduling", title: "Scheduling and communications", entries: ["Scheduling integrations"] },
      { id: "data", title: "Data", entries: ["PostgreSQL"] },
      { id: "platforms", title: "Delivery platforms", entries: ["Docker"] },
    ],
    production_title: "Production engineering",
    production: [
      { id: "containers", title: "Containerized delivery", body: "Dockerized services." },
      { id: "checks", title: "Automated checks", body: "CI pipelines." },
      { id: "health", title: "Health and readiness checks", body: "Health endpoints." },
      { id: "monitoring", title: "Monitoring and error tracking", body: "Sentry." },
      { id: "troubleshooting", title: "Production troubleshooting", body: "Live diagnosis." },
    ],
  };

  const { getByText, container } = render(
    <DeliveryCapabilities content={content} sectionName="Delivery & integrations" />
  );

  expect(getByText("Product discovery with stakeholders")).toBeInTheDocument();
  expect(getByText("Payments")).toBeInTheDocument();
  expect(getByText("Health and readiness checks")).toBeInTheDocument();
  expect(container.querySelector("#capability-map")).toBeTruthy();
  expect(container.querySelectorAll(".delivery-card").length).toBe(10);
  expect(container.querySelectorAll(".capability-map__group").length).toBe(5);
});

it("skips nonessential scroll motion when reduced motion is requested", () => {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));

  const { getByText, container } = render(
    <ScrollReveal>
      <p>Readable without waiting</p>
    </ScrollReveal>
  );

  expect(getByText("Readable without waiting")).toBeInTheDocument();
  expect(container.querySelector(".reveal.is-visible")).toBeTruthy();
  window.matchMedia = originalMatchMedia;
});

it("replays reveal motion when a section re-enters the viewport", () => {
  const OriginalObserver = window.IntersectionObserver;
  const originalMatchMedia = window.matchMedia;
  let observerCallback;
  window.IntersectionObserver = class {
    constructor(callback) {
      observerCallback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    media: "",
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));

  const { container } = render(
    <ScrollReveal>
      <p>Replay target</p>
    </ScrollReveal>
  );
  const node = container.querySelector(".reveal");

  act(() => {
    observerCallback([{ isIntersecting: true, target: node }]);
  });
  expect(node.classList.contains("is-visible")).toBe(true);

  act(() => {
    observerCallback([{ isIntersecting: false, target: node }]);
  });
  expect(node.classList.contains("is-visible")).toBe(false);

  act(() => {
    observerCallback([{ isIntersecting: true, target: node }]);
  });
  expect(node.classList.contains("is-visible")).toBe(true);

  window.IntersectionObserver = OriginalObserver;
  window.matchMedia = originalMatchMedia;
});

it("renders a scoring category when present", () => {
  const { getByText, container } = render(
    <TechStack
      stack={{
        backend: ["Python", "FastAPI"],
        scoring: ["CEFR/DELF rubrics", "Rule-based NLP"],
      }}
      labels={{
        backend: "Backend",
        scoring: "Scoring / AI",
      }}
    />
  );

  expect(getByText("Scoring / AI")).toBeInTheDocument();
  expect(getByText("Rule-based NLP")).toBeInTheDocument();
  expect(container.querySelectorAll(".tech-stack__group").length).toBe(2);
});

it("renders populated technology categories and omits empty ones", () => {
  const { getByText, queryByText, container } = render(
    <TechStack
      stack={{
        frontend: ["Next.js"],
        backend: ["NestJS"],
        storage: ["Amazon S3"],
        database: ["PostgreSQL"],
        integrations: ["Stripe"],
      }}
      labels={{
        frontend: "Frontend",
        backend: "Backend",
        storage: "Storage",
        database: "Database",
        integrations: "External integrations",
      }}
    />
  );

  expect(getByText("Frontend")).toBeInTheDocument();
  expect(getByText("Amazon S3")).toBeInTheDocument();
  expect(getByText("External integrations")).toBeInTheDocument();
  expect(queryByText("empty")).not.toBeInTheDocument();
  expect(container.querySelectorAll(".tech-stack__group").length).toBe(5);
});

it("does not render an empty technology category area", () => {
  const { container } = render(
    <TechStack stack={{ frontend: [], backend: [] }} labels={{ frontend: "Frontend" }} />
  );
  expect(container.querySelector(".tech-stack")).toBeNull();
});

it("shows categorized stacks on project cards instead of a flat list", () => {
  const { getByText, queryByText } = render(
    <Projects
      resumeProjects={[signProject]}
      resumeBasicInfo={basicInfo}
    />
  );

  expect(getByText("Frontend")).toBeInTheDocument();
  expect(getByText("Storage")).toBeInTheDocument();
  expect(getByText("Amazon S3")).toBeInTheDocument();
  expect(queryByText("Next.js · NestJS")).not.toBeInTheDocument();
});
