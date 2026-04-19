import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFirebaseConfig } from "../lib/env";

let app: FirebaseApp | null = null;
let analyticsStarted = false;

function startAnalyticsWhenReady(firebaseApp: FirebaseApp) {
  if (analyticsStarted || typeof window === "undefined") return;
  const mid = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim();
  if (!mid) return;
  analyticsStarted = true;
  void import("firebase/analytics")
    .then(({ getAnalytics, isSupported }) =>
      isSupported().then((ok) => {
        if (ok) getAnalytics(firebaseApp);
      }),
    )
    .catch(() => {
      analyticsStarted = false;
    });
}

export function getFirebaseApp(): FirebaseApp | null {
  const { config, isValid } = getFirebaseConfig();
  if (!isValid) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(config);
    startAnalyticsWhenReady(app);
  }
  return app;
}

export function getFirebaseAuth() {
  const a = getFirebaseApp();
  return a ? getAuth(a) : null;
}

export function getDb() {
  const a = getFirebaseApp();
  return a ? getFirestore(a) : null;
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseConfig().isValid;
}
