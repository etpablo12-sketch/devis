import {
  GlobeAltIcon,
  NewspaperIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { subscribePosts } from "../../services/hostedPostsService";
import { subscribeSiteSettings } from "../../services/siteSettingsService";
import { subscribeUsers } from "../../services/userService";
import type { HostedPost, SiteSettings, UserProfile } from "../../types/models";

export function AdminDashboardPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<HostedPost[]>([]);
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    const u = subscribeUsers(setUsers, (e) => setDataError((x) => x || e.message));
    const p = subscribePosts(setPosts, (e) => setDataError((x) => x || e.message));
    const s = subscribeSiteSettings(setSite);
    return () => {
      u?.();
      p?.();
      s?.();
    };
  }, []);

  const publishedPosts = posts.filter((x) => x.published).length;
  const lastSite = site?.updatedAt
    ? "Content saved in Firestore"
    : "No draft saved yet — use Site content";

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Live counts from <code className="text-xs">users</code> and <code className="text-xs">posts</code> (the public site reads posts marked as published).
      </p>

      {dataError && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          Firestore warning: {dataError} — confirm rules and deploy.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card padding="lg">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <UsersIcon className="h-4 w-4" aria-hidden />
            Users
          </div>
          <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900 dark:text-white">{users.length}</p>
          <Link to="/admin/users" className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
            View list →
          </Link>
        </Card>
        <Card padding="lg">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <NewspaperIcon className="h-4 w-4" aria-hidden />
            Posts
          </div>
          <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900 dark:text-white">{posts.length}</p>
          <p className="mt-1 text-xs text-zinc-500">{publishedPosts} live on the site</p>
          <Link to="/admin/posts" className="mt-2 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Manage posts →
          </Link>
        </Card>
        <Card padding="lg">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <GlobeAltIcon className="h-4 w-4" aria-hidden />
            Public site
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{lastSite}</p>
          <Link to="/admin/site" className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Edit content →
          </Link>
        </Card>
      </div>

      <Card padding="lg" className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Shortcuts</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          <li>
            <Link className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900" to="/admin/users">
              User list
            </Link>
          </li>
          <li>
            <Link className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900" to="/admin/posts">
              Hosted posts
            </Link>
          </li>
          <li>
            <Link className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900" to="/admin/site">
              Landing page copy
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );
}
