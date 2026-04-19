import type { SiteFeature } from "../types/models";

/** Shown when Firestore `site/settings` is missing or partial. */
export const DEFAULT_SITE_FEATURES: SiteFeature[] = [
  {
    title: "Book in seconds",
    body: "Pick a time, service, and a nearby professional without the hassle.",
  },
  {
    title: "Vetted professionals",
    body: "Portfolios, real reviews, and history so you can book with confidence.",
  },
  {
    title: "Secure payments",
    body: "Pix, card, and receipts — your details protected end to end.",
  },
];

export const DEFAULT_SITE_COPY = {
  heroBadge: "Beauty on demand",
  heroTitle: "Manicures wherever you are, with people you trust.",
  heroSubtitle:
    "We connect you with verified nail artists. Clean design, a fast flow, and an experience that feels native on mobile — and still shines on desktop.",
  heroImageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85",
  statAgenda: "24/7",
  statRating: "4.9",
  statCities: "120+",
  featuresSectionTitle: "Everything you need in one place",
  featuresSectionSubtitle:
    "Scheduling, verified profiles, and centralized management for your team in the admin dashboard.",
  contactSectionTitle: "Talk to Divas",
  contactSectionIntro:
    "Send a message — our team replies from the dashboard when possible.",
} as const;
