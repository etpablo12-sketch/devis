import { FirebaseError } from "firebase/app";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DivasLogo } from "../../components/DivasLogo";
import { ThemeToggle } from "../../components/layout/ThemeToggle";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { TextField } from "../../components/ui/TextField";
import { useAuth } from "../../context/AuthContext";
import { postLoginDestination } from "../../lib/adminAccess";
import { refreshProfileWithRetry } from "../../lib/refreshProfileRetry";
import { mapAuthError } from "../../services/authErrors";
import { getFirebaseAuth, isFirebaseConfigured } from "../../services/firebase";
import { cn } from "../../lib/cn";

export function SignupPage() {
  const navigate = useNavigate();
  const { signUpEmail, signInGoogle, refreshProfile } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Enter your name.";
    const em = email.trim();
    if (!em) e.email = "Enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) e.email = "Invalid email.";
    if (!password) e.password = "Choose a password.";
    else if (password.length < 8) e.password = "At least 8 characters.";
    if (password !== confirm) e.confirm = "Passwords do not match.";
    return e;
  }, [name, email, password, confirm]);

  const showErr = (k: string) => submitAttempted && errors[k];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isFirebaseConfigured()) {
      toast.error("Configure Firebase in .env.");
      return;
    }
    setSubmitAttempted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    try {
      const profile = await signUpEmail(name.trim(), email.trim(), password);
      toast.success("Account created!");
      const sessionEmail = getFirebaseAuth()?.currentUser?.email?.trim() || email.trim();
      navigate(postLoginDestination(profile, sessionEmail, "/app/listing"), { replace: true });
    } catch (err: unknown) {
      const code = err instanceof FirebaseError ? err.code : "";
      toast.error(code ? mapAuthError(code) : "Could not create the account.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogle() {
    if (!isFirebaseConfigured()) {
      toast.error("Configure Firebase in .env.");
      return;
    }
    setIsLoading(true);
    try {
      await signInGoogle();
      const profile = await refreshProfileWithRetry(refreshProfile);
      const sessionEmail = getFirebaseAuth()?.currentUser?.email?.trim() || "";
      toast.success("Account connected!");
      navigate(postLoginDestination(profile, sessionEmail, "/app/listing"), { replace: true });
    } catch (err: unknown) {
      const code = err instanceof FirebaseError ? err.code : "";
      toast.error(code ? mapAuthError(code) : "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-200/80 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6">
        <Link to="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
          ← Back
        </Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <DivasLogo className="mx-auto text-4xl text-primary-600 dark:text-primary-400" />
          <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">Create account</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Takes less than a minute.</p>
        </div>

        <Card padding="lg">
          <Button type="button" variant="outline" className="mb-6 w-full" disabled={isLoading} onClick={handleGoogle}>
            Continue with Google
          </Button>
          <div className="relative mb-6 text-center text-xs text-zinc-400">
            <span className="relative z-10 bg-white px-2 dark:bg-zinc-900">or</span>
            <span className="absolute left-0 top-1/2 z-0 h-px w-full bg-zinc-200 dark:bg-zinc-700" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <TextField
              id="su-name"
              label="Full name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={showErr("name") ? errors.name : undefined}
            />
            <TextField
              id="su-email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={showErr("email") ? errors.email : undefined}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
              <div
                className={cn(
                  "flex overflow-hidden rounded-lg border bg-white dark:bg-zinc-950",
                  showErr("password") ? "border-red-500" : "border-zinc-300 dark:border-zinc-600",
                )}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  className="min-h-[44px] flex-1 border-0 px-4 py-2 text-sm outline-none dark:bg-zinc-950 dark:text-zinc-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="px-3 text-zinc-500"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {showErr("password") && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <TextField
              id="su-confirm"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={showErr("confirm") ? errors.confirm : undefined}
            />
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign up
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
