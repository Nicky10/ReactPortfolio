import React from "react";
import { render, fireEvent } from "@testing-library/react";
import PositioningBlock, {
  RecruiterCallToAction,
} from "./Positioning";
import CaseStudies from "./CaseStudies";
import DeliveryCapabilities from "./DeliveryCapabilities";

const positioning = {
  impact: {
    eyebrow: "Verified impact",
    title: "Outcomes recruiters can check",
    metrics: [
      { id: "experience", value: "4+", label: "years of commercial experience" },
      { id: "pie_users", value: "100+", label: "PIE users per week" },
      { id: "sign_savings", value: "~$20K", label: "Immiland Sign annual cost savings" },
      { id: "revenue", value: "$10K+", label: "additional monthly revenue from payment workflows" },
    ],
  },
  role_paths: {
    eyebrow: "Hiring path",
    title: "Go to the evidence for your role",
    paths: [
      {
        id: "full-stack",
        title: "Full-stack product engineering",
        description: "Product delivery",
        cta: "View product evidence",
        target: "case-studies",
      },
      {
        id: "backend",
        title: "Backend and integrations engineering",
        description: "APIs and ops",
        cta: "View delivery evidence",
        target: "delivery-capabilities",
      },
    ],
  },
};

const recruiterCta = {
  hiring_focus: "Hiring focus: full-stack, platform, and integrations engineering",
  title: "Next step for hiring teams",
  availability: "Open to full-stack roles",
  resume: "Download resume",
  contact: "Contact Nicolas",
  linkedin: "LinkedIn",
  github: "GitHub",
};

const shared = {
  social: [
    { name: "github", url: "https://github.com/Nicky10" },
    { name: "linkedIn", url: "https://www.linkedin.com/in/nicolas-felipe-delgado/" },
  ],
};

it("renders the verified impact snapshot and role paths", () => {
  const { getByText, getByRole } = render(
    <PositioningBlock
      positioning={positioning}
      recruiterCta={recruiterCta}
      sharedBasicInfo={shared}
      resumeHref="/Resume_Nicolas_Delgado.pdf"
      onContactClick={() => {}}
    />
  );

  expect(getByText("4+")).toBeInTheDocument();
  expect(getByText("100+")).toBeInTheDocument();
  expect(getByText("~$20K")).toBeInTheDocument();
  expect(getByText("$10K+")).toBeInTheDocument();
  expect(
    getByRole("button", { name: /Full-stack product engineering/ })
  ).toBeInTheDocument();
  expect(
    getByRole("button", { name: /Backend and integrations engineering/ })
  ).toBeInTheDocument();
});

it("exposes recruiter routes to resume, contact, LinkedIn, and GitHub", () => {
  const onContact = jest.fn();
  const { getByRole } = render(
    <RecruiterCallToAction
      content={recruiterCta}
      sharedBasicInfo={shared}
      resumeHref="/Resume_Nicolas_Delgado.pdf"
      onContactClick={onContact}
    />
  );

  expect(getByRole("link", { name: "Download resume" })).toHaveAttribute(
    "href",
    "/Resume_Nicolas_Delgado.pdf"
  );
  fireEvent.click(getByRole("button", { name: "Contact Nicolas" }));
  expect(onContact).toHaveBeenCalled();
  expect(getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/nicolas-felipe-delgado/"
  );
  expect(getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/Nicky10"
  );
  expect(
    getByRole("heading", {
      name: "Next step for hiring teams",
    })
  ).toBeInTheDocument();
});

it("identifies Immiland Sign and PIE as case studies with sanitized Sign access", () => {
  const content = {
    lead: "Selected work",
    badge: "Case study",
    open: "View case study",
    labels: {
      problem: "Business problem",
      ownership: "Ownership",
      delivery: "Delivered capability",
      technologies: "Technologies",
      integrations: "Integrations",
      outcomes: "Verified outcomes",
    },
    items: [
      {
        id: "immiland-sign",
        title: "Immiland Sign",
        access: "corporate",
        image: "images/portfolio/immiland-sign/immiland-sign.png",
        problem: "Need a lower-cost signing path.",
        ownership: "Primary author.",
        delivery: "Production e-signature product.",
        technologies: ["Next.js"],
        integrations: ["Stripe"],
        outcomes: [
          { value: "~$20K", label: "annual operating cost savings" },
          { value: "35%", label: "document-processing productivity improvement" },
        ],
        availability_note: "Corporate login required — public access is not available.",
      },
      {
        id: "pie-placement",
        title: "PIE Placement Exam Platform",
        access: "public",
        image: "images/portfolio/pie-placement/pie-placement-test.png",
        problem: "Need automated placement.",
        ownership: "Built the platform.",
        delivery: "Placement product.",
        technologies: ["React"],
        integrations: ["FastAPI scoring service"],
        outcomes: [{ value: "100+", label: "users per week" }],
      },
    ],
  };

  const { getByText, getByRole } = render(
    <CaseStudies content={content} sectionName="Selected case studies" />
  );

  expect(getByText("Immiland Sign")).toBeInTheDocument();
  expect(getByText("PIE Placement Exam Platform")).toBeInTheDocument();
  fireEvent.click(getByRole("button", { name: /Immiland Sign/ }));
  expect(
    getByText("Corporate login required — public access is not available.")
  ).toBeInTheDocument();
  expect(
    getByRole("dialog").textContent
  ).toMatch(/annual operating cost savings/);
});

it("renders delivery approach, systems groups, and production evidence", () => {
  const content = {
    lead: "How work is delivered",
    approach_title: "Delivery approach",
    approach: [
      { title: "Product discovery with stakeholders", body: "Clarify requirements." },
      { title: "System and API design", body: "Design contracts." },
      { title: "Full-stack delivery", body: "Ship features." },
      { title: "Integrations and automation", body: "Connect systems." },
      { title: "Production support", body: "Operate after release." },
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
      { title: "Containerized delivery", body: "Dockerized services." },
      { title: "Automated checks", body: "CI pipelines." },
      { title: "Health and readiness checks", body: "Health endpoints." },
      { title: "Monitoring and error tracking", body: "Sentry." },
      { title: "Production troubleshooting", body: "Live diagnosis." },
    ],
  };

  const { getByText } = render(
    <DeliveryCapabilities content={content} sectionName="Delivery & integrations" />
  );

  expect(getByText("Product discovery with stakeholders")).toBeInTheDocument();
  expect(getByText("Payments")).toBeInTheDocument();
  expect(getByText("Health and readiness checks")).toBeInTheDocument();
});
