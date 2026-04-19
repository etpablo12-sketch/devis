export function getFirebaseConfig() {
  const measurementId =
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim() || undefined;
  const c = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    ...(measurementId ? { measurementId } : {}),
  };
  const ok = Boolean(c.apiKey && c.authDomain && c.projectId && c.appId);
  return { config: c, isValid: ok };
}

export function getBootstrapAdminEmails(): string[] {
  const raw = import.meta.env.VITE_BOOTSTRAP_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}


// 