import {
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Container } from "../components/ui/Container";
import { TextField } from "../components/ui/TextField";
import { useAuth } from "../context/AuthContext";
import { isFirebaseConfigured } from "../services/firebase";
import { subscribePublishedPosts } from "../services/hostedPostsService";
import { submitMessage } from "../services/messageService";
import { mergeSiteSettings, subscribeSiteSettings } from "../services/siteSettingsService";
import type { HostedPost, SiteSettings } from "../types/models";

const featureIcons = [CalendarDaysIcon, SparklesIcon, ShieldCheckIcon] as const;

export function LandingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [site, setSite] = useState<SiteSettings>(() => mergeSiteSettings(null));
  const [posts, setPosts] = useState<HostedPost[]>([]);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const u1 = subscribeSiteSettings((s) => setSite(mergeSiteSettings(s)));
    const u2 = subscribePublishedPosts(setPosts);
    return () => {
      u1?.();
      u2?.();
    };
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  async function handleContact(e: FormEvent) {
    e.preventDefault();
    if (!isFirebaseConfigured()) {
      toast.error("Configure Firebase in .env to send messages.");
      return;
    }
    const nm = name.trim();
    const em = email.trim();
    const msg = message.trim();
    if (!nm || !em || !msg) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    setLoading(true);
    try {
      await submitMessage({
        userId: user?.uid ?? null,
        name: nm,
        email: em,
        message: msg,
      });
      setSent(true);
      toast.success("Message sent! Our team will reply soon.");
    } catch {
      toast.error("Could not send. Check Firestore rules and your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(228_228_231)_1px,transparent_1px),linear-gradient(to_bottom,rgb(228_228_231)_1px,transparent_1px)] bg-[length:24px_24px] opacity-[0.45] dark:bg-[linear-gradient(to_right,rgb(63_63_70)_1px,transparent_1px),linear-gradient(to_bottom,rgb(63_63_70)_1px,transparent_1px)] dark:opacity-[0.35]"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-primary-700/5 dark:from-primary-600/15" />
          <Container className="relative py-16 sm:py-20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-28 xl:py-32">
            <div className="lg:col-span-7 animate-fade-in">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 shadow-sm dark:border-primary-800/50 dark:bg-zinc-900/90 dark:text-primary-300">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                {site.heroBadge}
              </p>
              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1] dark:text-white">
                {site.heroTitle}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600 sm:text-xl dark:text-zinc-400">{site.heroSubtitle}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Button size="lg" type="button" className="min-w-[200px] sm:w-auto" onClick={() => navigate("/app/listing")}>
                  Browse manicurists
                </Button>
                <Button variant="outline" size="lg" type="button" className="min-w-[200px] sm:w-auto" onClick={() => navigate(user ? "/app/listing" : "/login")}>
                  {user ? "My account" : "I have an account"}
                </Button>
              </div>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-zinc-200/80 pt-10 sm:max-w-lg dark:border-zinc-700/80">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">Booking</dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">{site.statAgenda}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Rating</dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">{site.statRating}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Cities</dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">{site.statCities}</dd>
                </div>
              </dl>
            </div>
            <div className="relative mt-14 lg:col-span-5 lg:mt-0">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-200 shadow-card-hover dark:border-zinc-700 dark:bg-zinc-800">
                <img src={site.heroImageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="absolute -bottom-4 -left-4 flex max-w-[240px] items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-card dark:border-zinc-700 dark:bg-zinc-900 sm:-bottom-6 sm:left-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">Human support</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">Quick replies through the app.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="features" className="scroll-mt-20 py-16 sm:py-20 lg:py-28">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">{site.featuresSectionTitle}</h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{site.featuresSectionSubtitle}</p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {site.features.map(({ title, body }, i) => {
                const Icon = featureIcons[i % featureIcons.length]!;
                return (
                  <li key={`${title}-${i}`}>
                    <Card padding="lg" className="h-full transition-shadow duration-200 hover:shadow-card-hover dark:hover:border-zinc-700">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{body}</p>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>

        <section id="news" className="scroll-mt-20 border-y border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950 sm:py-20 lg:py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">News</h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Published by the team from the admin dashboard.</p>
            </div>
            {posts.length === 0 ? (
              <p className="mx-auto mt-10 max-w-md text-center text-sm text-zinc-500">
                No posts yet. In the admin, go to <strong>Posts</strong> and mark an entry as published.
              </p>
            ) : (
              <ul className="mt-12 grid gap-8 lg:grid-cols-2">
                {posts.map((p) => (
                  <li key={p.id}>
                    <Card padding="lg" className="h-full shadow-card-hover">
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{p.title}</h3>
                      {p.excerpt ? <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{p.excerpt}</p> : null}
                      <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{p.body}</div>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </section>

        <section id="contact" className="scroll-mt-20 border-y border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/40 sm:py-20 lg:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{site.contactSectionTitle}</h2>
                <p className="mt-4 text-lg whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{site.contactSectionIntro}</p>
              </div>
              <Card padding="lg" className="shadow-card-hover">
                {sent ? (
                  <p className="py-8 text-center text-sm font-medium text-primary-700 dark:text-primary-300">
                    Thanks — we received your message and will get back to you soon.
                  </p>
                ) : (
                  <form className="space-y-5" onSubmit={handleContact}>
                    <TextField
                      id="contact-name"
                      name="name"
                      label="Name"
                      placeholder="Your name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                      id="contact-email"
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      helperText="We only use this to reply to you."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div>
                      <label htmlFor="contact-msg" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Message
                      </label>
                      <textarea
                        id="contact-msg"
                        name="message"
                        rows={4}
                        placeholder="How can we help?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-primary-500"
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                      Send message
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
