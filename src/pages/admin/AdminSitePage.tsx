import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { TextField } from "../../components/ui/TextField";
import { mergeSiteSettings, saveSiteSettings, subscribeSiteSettings } from "../../services/siteSettingsService";
import type { SiteFeature, SiteSettings } from "../../types/models";

function emptyDraft(): SiteSettings {
  return mergeSiteSettings(null);
}

export function AdminSitePage() {
  const [draft, setDraft] = useState<SiteSettings>(emptyDraft);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeSiteSettings((s) => setDraft(s));
    return () => unsub?.();
  }, []);

  function setField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function updateFeature(index: number, patch: Partial<SiteFeature>) {
    setDraft((d) => {
      const features = [...d.features];
      features[index] = { ...features[index]!, ...patch };
      return { ...d, features };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { updatedAt: _u, ...rest } = draft;
      await saveSiteSettings(rest);
      toast.success("Site updated.");
    } catch {
      toast.error("Could not save. Check Firestore permissions.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Site content</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Edit copy and blocks for the public landing page. Changes appear after you save.
      </p>

      <div className="mt-8 space-y-8">
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Hero</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextField id="heroBadge" label="Badge" value={draft.heroBadge} onChange={(e) => setField("heroBadge", e.target.value)} />
            <TextField id="heroImageUrl" label="Hero image URL" value={draft.heroImageUrl} onChange={(e) => setField("heroImageUrl", e.target.value)} />
          </div>
          <TextField
            id="heroTitle"
            label="Headline"
            className="mt-4"
            value={draft.heroTitle}
            onChange={(e) => setField("heroTitle", e.target.value)}
          />
          <div className="mt-4">
            <label htmlFor="heroSubtitle" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Subtitle
            </label>
            <textarea
              id="heroSubtitle"
              rows={3}
              value={draft.heroSubtitle}
              onChange={(e) => setField("heroSubtitle", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <TextField id="statAgenda" label="Stat: Booking" value={draft.statAgenda} onChange={(e) => setField("statAgenda", e.target.value)} />
            <TextField id="statRating" label="Stat: Rating" value={draft.statRating} onChange={(e) => setField("statRating", e.target.value)} />
            <TextField id="statCities" label="Stat: Cities" value={draft.statCities} onChange={(e) => setField("statCities", e.target.value)} />
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Features (cards)</h2>
          <TextField
            id="featuresSectionTitle"
            label="Section title"
            className="mt-4"
            value={draft.featuresSectionTitle}
            onChange={(e) => setField("featuresSectionTitle", e.target.value)}
          />
          <div className="mt-4">
            <label htmlFor="featuresSectionSubtitle" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Section subtitle
            </label>
            <textarea
              id="featuresSectionSubtitle"
              rows={2}
              value={draft.featuresSectionSubtitle}
              onChange={(e) => setField("featuresSectionSubtitle", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <ul className="mt-6 space-y-4">
            {draft.features.map((f, i) => (
              <li key={i} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold uppercase text-zinc-500">Card {i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        features: d.features.filter((_, j) => j !== i),
                      }))
                    }
                  >
                    Remove
                  </Button>
                </div>
                <TextField id={`ft-${i}-t`} label="Title" className="mt-2" value={f.title} onChange={(e) => updateFeature(i, { title: e.target.value })} />
                <div className="mt-2">
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Body</label>
                  <textarea
                    rows={2}
                    value={f.body}
                    onChange={(e) => updateFeature(i, { body: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </div>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                features: [...d.features, { title: "New highlight", body: "Short description." }],
              }))
            }
          >
            Add card
          </Button>
        </Card>

        <Card padding="lg">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Contact (section)</h2>
          <TextField
            id="contactSectionTitle"
            label="Title"
            className="mt-4"
            value={draft.contactSectionTitle}
            onChange={(e) => setField("contactSectionTitle", e.target.value)}
          />
          <div className="mt-4">
            <label htmlFor="contactSectionIntro" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Intro copy
            </label>
            <textarea
              id="contactSectionIntro"
              rows={4}
              value={draft.contactSectionIntro}
              onChange={(e) => setField("contactSectionIntro", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="button" size="lg" isLoading={saving} onClick={handleSave}>
            Save site
          </Button>
        </div>
      </div>
    </div>
  );
}
