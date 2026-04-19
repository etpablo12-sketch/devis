import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";
import { getDb } from "./firebase";
import type { SiteFeature, SiteSettings } from "../types/models";
import { DEFAULT_SITE_COPY, DEFAULT_SITE_FEATURES } from "../lib/defaultSiteContent";

const COL = "site";
const SETTINGS_ID = "settings";

function mapSettings(_id: string, data: Record<string, unknown>): SiteSettings {
  const featuresRaw = data.features as SiteFeature[] | undefined;
  const features =
    Array.isArray(featuresRaw) && featuresRaw.length > 0
      ? featuresRaw.map((f) => ({
          title: String(f.title ?? ""),
          body: String(f.body ?? ""),
        }))
      : DEFAULT_SITE_FEATURES;

  return {
    heroBadge: (data.heroBadge as string) || DEFAULT_SITE_COPY.heroBadge,
    heroTitle: (data.heroTitle as string) || DEFAULT_SITE_COPY.heroTitle,
    heroSubtitle: (data.heroSubtitle as string) || DEFAULT_SITE_COPY.heroSubtitle,
    heroImageUrl: (data.heroImageUrl as string) || DEFAULT_SITE_COPY.heroImageUrl,
    statAgenda: (data.statAgenda as string) || DEFAULT_SITE_COPY.statAgenda,
    statRating: (data.statRating as string) || DEFAULT_SITE_COPY.statRating,
    statCities: (data.statCities as string) || DEFAULT_SITE_COPY.statCities,
    featuresSectionTitle: (data.featuresSectionTitle as string) || DEFAULT_SITE_COPY.featuresSectionTitle,
    featuresSectionSubtitle: (data.featuresSectionSubtitle as string) || DEFAULT_SITE_COPY.featuresSectionSubtitle,
    features,
    contactSectionTitle: (data.contactSectionTitle as string) || DEFAULT_SITE_COPY.contactSectionTitle,
    contactSectionIntro: (data.contactSectionIntro as string) || DEFAULT_SITE_COPY.contactSectionIntro,
    updatedAt: (data.updatedAt as SiteSettings["updatedAt"]) ?? null,
  };
}

/** Merge remote settings with defaults (for public landing). */
export function mergeSiteSettings(data: Partial<SiteSettings> | null): SiteSettings {
  if (!data) {
    return {
      ...DEFAULT_SITE_COPY,
      features: DEFAULT_SITE_FEATURES,
      updatedAt: null,
    };
  }
  return {
    heroBadge: data.heroBadge ?? DEFAULT_SITE_COPY.heroBadge,
    heroTitle: data.heroTitle ?? DEFAULT_SITE_COPY.heroTitle,
    heroSubtitle: data.heroSubtitle ?? DEFAULT_SITE_COPY.heroSubtitle,
    heroImageUrl: data.heroImageUrl ?? DEFAULT_SITE_COPY.heroImageUrl,
    statAgenda: data.statAgenda ?? DEFAULT_SITE_COPY.statAgenda,
    statRating: data.statRating ?? DEFAULT_SITE_COPY.statRating,
    statCities: data.statCities ?? DEFAULT_SITE_COPY.statCities,
    featuresSectionTitle: data.featuresSectionTitle ?? DEFAULT_SITE_COPY.featuresSectionTitle,
    featuresSectionSubtitle: data.featuresSectionSubtitle ?? DEFAULT_SITE_COPY.featuresSectionSubtitle,
    features: data.features?.length ? data.features : DEFAULT_SITE_FEATURES,
    contactSectionTitle: data.contactSectionTitle ?? DEFAULT_SITE_COPY.contactSectionTitle,
    contactSectionIntro: data.contactSectionIntro ?? DEFAULT_SITE_COPY.contactSectionIntro,
    updatedAt: data.updatedAt ?? null,
  };
}

export function subscribeSiteSettings(callback: (settings: SiteSettings) => void): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;
  const ref = doc(db, COL, SETTINGS_ID);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(mergeSiteSettings(null));
      return;
    }
    callback(mapSettings(snap.id, snap.data() as Record<string, unknown>));
  });
}

export async function saveSiteSettings(input: Omit<SiteSettings, "updatedAt">): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  await setDoc(
    doc(db, COL, SETTINGS_ID),
    {
      heroBadge: input.heroBadge.trim(),
      heroTitle: input.heroTitle.trim(),
      heroSubtitle: input.heroSubtitle.trim(),
      heroImageUrl: input.heroImageUrl.trim(),
      statAgenda: input.statAgenda.trim(),
      statRating: input.statRating.trim(),
      statCities: input.statCities.trim(),
      featuresSectionTitle: input.featuresSectionTitle.trim(),
      featuresSectionSubtitle: input.featuresSectionSubtitle.trim(),
      features: input.features.map((f) => ({ title: f.title.trim(), body: f.body.trim() })),
      contactSectionTitle: input.contactSectionTitle.trim(),
      contactSectionIntro: input.contactSectionIntro.trim(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
