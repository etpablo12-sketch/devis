import type { Timestamp } from "firebase/firestore";

export type UserRole = "user" | "admin";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp | null;
};

export type MessageStatus = "pending" | "reviewed" | "resolved";

export type Manicurist = {
  id: string;
  name: string;
  rating: string;
  address: string;
  price: string;
  avatar: string;
};

export type SupportMessage = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  message: string;
  status: MessageStatus;
  createdAt: Timestamp | null;
};

/** Editable marketing block on the landing page (Firestore `site/settings`). */
export type SiteFeature = {
  title: string;
  body: string;
};

export type SiteSettings = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  statAgenda: string;
  statRating: string;
  statCities: string;
  featuresSectionTitle: string;
  featuresSectionSubtitle: string;
  features: SiteFeature[];
  contactSectionTitle: string;
  contactSectionIntro: string;
  updatedAt: Timestamp | null;
};

/** Public or draft article for the site (`posts` collection). */
export type HostedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  published: boolean;
  order: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};
