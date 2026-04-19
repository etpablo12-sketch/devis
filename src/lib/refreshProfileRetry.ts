import type { UserProfile } from "../types/models";

/** Re-resolve Firestore profile a few times (avoids null on first tick after sign-in). */
export async function refreshProfileWithRetry(
  refreshProfile: () => Promise<UserProfile | null>,
): Promise<UserProfile | null> {
  let p = await refreshProfile();
  if (p != null) return p;
  for (let i = 0; i < 5; i++) {
    await new Promise((r) => setTimeout(r, 100 + i * 80));
    p = await refreshProfile();
    if (p != null) return p;
  }
  return null;
}
