import { getBootstrapAdminEmails } from "./env";
import type { UserProfile } from "../types/models";

/**
 * Who may open the admin dashboard:
 * — Firestore role `admin`, or
 * — email listed in `VITE_BOOTSTRAP_ADMIN_EMAILS` while the user doc has not been created yet (`profile === null`).
 */
export function hasAdminDashboardAccess(profile: UserProfile | null, email: string | null | undefined): boolean {
  if (profile?.role === "admin") return true;
  const e = email?.trim().toLowerCase();
  if (!e || profile !== null) return false;
  return getBootstrapAdminEmails().includes(e);
}

/** Target route after email/Google sign-in or sign-up. */
export function postLoginDestination(
  profile: UserProfile | null,
  email: string | null | undefined,
  fallback: string,
): string {
  if (profile?.role === "admin") return "/admin";
  const e = email?.trim().toLowerCase();
  if (e && getBootstrapAdminEmails().includes(e) && profile === null) return "/admin";
  return fallback;
}
