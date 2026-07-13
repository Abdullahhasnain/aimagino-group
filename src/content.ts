// All human-readable copy + data for the AImagino journey lives here so the
// 3D scenes and the HTML overlay stay in sync from a single source of truth.

import type { SectionId } from "./theme";

export interface SectionCopy {
  id: SectionId;
  kicker: string; // small label above the title
  title: string;
  tagline: string;
  bullets?: string[];
}

export const COMPANY = {
  name: "AImagino Solution",
  founder: "Abdullah Hasnain",
  location: "Karachi, Pakistan",
  email: "aimaginosolution22@gmail.com",
  altEmail: "abdullahasnain186@gmail.com",
  whatsapp: "https://wa.me/923710023087",
  linkedin: "https://www.linkedin.com/in/abdullah-hasnain-82b142294",
  instagram: "https://www.instagram.com/aimaginosolution/",
  reach: "Serving clients remotely across the USA, Spain, and Pakistan.",
};

export const COPY: Record<SectionId, SectionCopy> = {
  exterior: {
    id: "exterior",
    kicker: "Welcome",
    title: "AImagino Solution",
    tagline:
      "Step inside the headquarters of an autonomous AI company. Scroll to walk through the building.",
  },
  agents: {
    id: "agents",
    kicker: "Department 01",
    title: "AI Agent Control Room",
    tagline:
      "A floor of holographic assistants handling conversations around the clock.",
    bullets: [
      "AI Customer Support Agents",
      "AI Voice Agents",
      "AI Sales Agents",
      "WhatsApp AI Agents",
      "Internal Company Assistants",
    ],
  },
  automation: {
    id: "automation",
    kicker: "Department 02",
    title: "AI Automation Factory",
    tagline:
      "Business processes run themselves on an assembly line that never stops.",
    bullets: [
      "Email & CRM automation",
      "Lead generation pipelines",
      "Workflow automation",
      "Document, invoice & approval flows",
      "End-to-end business operations",
    ],
  },
  data: {
    id: "data",
    kicker: "Department 03",
    title: "Data Infrastructure Center",
    tagline:
      "Thousands of servers, moving data particles, and a room that feels alive.",
    bullets: [
      "Cloud architecture",
      "Vector databases",
      "Knowledge graphs",
      "Real-time analytics",
    ],
  },
  lab: {
    id: "lab",
    kicker: "Department 04",
    title: "Enterprise AI Lab",
    tagline:
      "Where engineers build the intelligent systems behind everything else.",
    bullets: [
      "Predictive analytics & ML models",
      "Business intelligence dashboards",
      "RAG systems & LLM integrations",
      "Multi-agent systems & digital twins",
    ],
  },
  industries: {
    id: "industries",
    kicker: "Reach",
    title: "Industries We Serve",
    tagline: COMPANY.reach,
    bullets: [
      "Healthcare",
      "Real Estate",
      "Construction",
      "Finance",
      "Legal",
      "Manufacturing",
      "E-commerce",
      "Education",
      "Insurance",
      "Logistics",
      "Marketing Agencies",
      "SaaS",
      "Professional Services",
    ],
  },
  portfolio: {
    id: "portfolio",
    kicker: "Portfolio",
    title: "Proof, In Glass",
    tagline: "Selected builds, floating as living holograms.",
  },
  why: {
    id: "why",
    kicker: "Why AImagino",
    title: "One Core, Infinite Output",
    tagline:
      "A single neural core powering agents, automation, and enterprise intelligence.",
    bullets: [
      "Ship in weeks, not quarters",
      "Enterprise-grade reliability",
      "Human + AI, working as one",
      "Transparent, measurable ROI",
    ],
  },
  contact: {
    id: "contact",
    kicker: "Command Center",
    title: "Start Your AI Project",
    tagline:
      "Reach the command center and let's build your intelligent systems.",
  },
};

// Countries lit up on the industries globe.
export const COUNTRIES = [
  { name: "United States", flag: "🇺🇸", lat: 39, lon: -98 },
  { name: "Spain", flag: "🇪🇸", lat: 40, lon: -3 },
  { name: "Pakistan", flag: "🇵🇰", lat: 30, lon: 69 },
] as const;

// Portfolio "holograms" in the museum. Stats are illustrative outcomes.
export interface Project {
  title: string;
  domain: string;
  before: string;
  after: string;
  metric: string;
}

export const PROJECTS: Project[] = [
  {
    title: "24/7 Support Agent",
    domain: "E-commerce",
    before: "8h avg reply",
    after: "12s avg reply",
    metric: "-92% tickets",
  },
  {
    title: "Voice Booking Concierge",
    domain: "Healthcare",
    before: "40% no-shows",
    after: "9% no-shows",
    metric: "+3.1x bookings",
  },
  {
    title: "Lead-to-Deal Pipeline",
    domain: "Real Estate",
    before: "Manual chase",
    after: "Auto-qualified",
    metric: "+68% conversion",
  },
  {
    title: "Document Intelligence",
    domain: "Legal",
    before: "6h review",
    after: "4m review",
    metric: "-97% time",
  },
  {
    title: "RAG Knowledge Desk",
    domain: "SaaS",
    before: "Scattered docs",
    after: "Instant answers",
    metric: "+54% CSAT",
  },
  {
    title: "Invoice Autopilot",
    domain: "Finance",
    before: "Weekly batches",
    after: "Real-time",
    metric: "-80% errors",
  },
];
