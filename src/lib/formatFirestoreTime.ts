import type { Timestamp } from "firebase/firestore";

export function formatFirestoreTime(ts: Timestamp | null | undefined, locale = "pt-BR"): string {
  if (!ts?.toDate) return "—";
  try {
    return ts.toDate().toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "—";
  }
}
