import { Link } from "react-router-dom";
import { isFirebaseConfigured } from "../../services/firebase";

export function FirebaseBanner() {
  if (isFirebaseConfigured()) return null;
  return (
    <div className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/80 dark:text-amber-100">
      <strong className="font-semibold">Firebase is not configured.</strong> Copy{" "}
      <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">.env.example</code> to{" "}
      <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">.env</code> and add your project keys.{" "}
      <a
        href="https://firebase.google.com/docs/web/setup"
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2"
      >
        Documentation
      </a>
      {" · "}
      <Link to="/login" className="underline underline-offset-2">
        Sign in
      </Link>
    </div>
  );
}
