import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FirebaseError } from "firebase/app";
import { type FormEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/app/listing";

  const { signInEmail, signInGoogle, refreshProfile } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const errors = useMemo(() => {
    const e: { email?: string; password?: string } = {};
    const em = email.trim();
    if (!em) e.email = "Enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) e.email = "Invalid email.";
    if (!password) e.password = "Enter your password.";
    else if (password.length < 8) e.password = "Password must be at least 8 characters.";
    return e;
  }, [email, password]);

  const showEmailError = (touched.email || submitAttempted) && errors.email;
  const showPasswordError = (touched.password || submitAttempted) && errors.password;
  const isValid = !errors.email && !errors.password;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isFirebaseConfigured()) {
      toast.error("Configure Firebase in .env to sign in.");
      return;
    }
    setSubmitAttempted(true);
    if (!isValid) return;
    setIsLoading(true);
    try {
      await signInEmail(email, password);
      const profile = await refreshProfileWithRetry(refreshProfile);
      const sessionEmail = getFirebaseAuth()?.currentUser?.email?.trim() || email.trim();
      toast.success("Signed in!");
      navigate(postLoginDestination(profile, sessionEmail, from), { replace: true });
    } catch (err: unknown) {
      const code = err instanceof FirebaseError ? err.code : "";
      toast.error(code ? mapAuthError(code) : "Sign-in failed.");
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
      toast.success("Signed in!");
      navigate(postLoginDestination(profile, sessionEmail, from), { replace: true });
    } catch (err: unknown) {
      const code = err instanceof FirebaseError ? err.code : "";
      toast.error(code ? mapAuthError(code) : "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
        <aside className="relative hidden flex-1 flex-col justify-end overflow-hidden p-10 text-white lg:flex lg:max-w-[46%] lg:p-12 xl:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-zinc-900" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80)",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-primary-900/20" aria-hidden />
          <div className="relative z-10 max-w-md">
            <DivasLogo className="text-5xl text-white drop-shadow-sm xl:text-6xl" />
            <p className="mt-6 text-lg font-medium leading-relaxed text-primary-100/95">
              Sign in to book, pay securely, and track your appointments.
            </p>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-zinc-200/80 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/90 sm:px-6">
            <Link
              to="/"
              className="text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              ← Back to site
            </Link>
            <ThemeToggle />
          </header>

          <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Divas account</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">Sign in</h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Use email and password or continue with Google.</p>
              </div>

              <div className="mb-6 flex justify-center lg:hidden">
                <DivasLogo className="text-4xl text-primary-600 dark:text-primary-400" />
              </div>

              <Card padding="lg" className="shadow-card-hover">
                <Button
                  type="button"
                  variant="outline"
                  className="mb-6 w-full border-zinc-300 dark:border-zinc-600"
                  disabled={isLoading}
                  onClick={handleGoogle}
                >
                  Continue with Google
                </Button>

                <div className="relative mb-6 text-center text-xs text-zinc-400">
                  <span className="relative z-10 bg-white px-2 dark:bg-zinc-900">or with email</span>
                  <span className="absolute left-0 top-1/2 z-0 h-px w-full bg-zinc-200 dark:bg-zinc-700" />
                </div>

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <TextField
                    id="login-email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    error={showEmailError ? errors.email : undefined}
                    helperText={!showEmailError ? undefined : undefined}
                  />

                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <label htmlFor="login-password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div
                      className={cn(
                        "flex items-stretch overflow-hidden rounded-lg border bg-white transition duration-200 dark:bg-zinc-950",
                        "focus-within:ring-2 focus-within:ring-primary-500/30",
                        showPasswordError
                          ? "border-red-500 ring-2 ring-red-500/15 dark:border-red-400"
                          : "border-zinc-300 focus-within:border-primary-500 dark:border-zinc-600",
                      )}
                    >
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                        aria-invalid={Boolean(showPasswordError)}
                        placeholder="••••••••"
                        className="min-h-[44px] flex-1 px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                      />
                      <span className="flex shrink-0 items-center border-l border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                        <button
                          type="button"
                          className="p-3 text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </span>
                    </div>
                    {showPasswordError && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Sign in
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    Create account
                  </Link>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
