import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { HostedPost } from "../types/models";

const COL = "posts";

function mapPost(id: string, data: Record<string, unknown>): HostedPost {
  return {
    id,
    title: (data.title as string) || "",
    slug: (data.slug as string) || "",
    excerpt: (data.excerpt as string) || "",
    body: (data.body as string) || "",
    published: Boolean(data.published),
    order: typeof data.order === "number" ? data.order : Number(data.order) || 0,
    createdAt: (data.createdAt as HostedPost["createdAt"]) ?? null,
    updatedAt: (data.updatedAt as HostedPost["updatedAt"]) ?? null,
  };
}

function sortPostsForAdmin(a: HostedPost, b: HostedPost): number {
  if (a.order !== b.order) return a.order - b.order;
  const ta = a.createdAt?.toMillis?.() ?? 0;
  const tb = b.createdAt?.toMillis?.() ?? 0;
  return tb - ta;
}

/**
 * All posts for admin (drafts + published). Full collection snapshot — sort in memory
 * so missing fields or indexes cannot empty the UI.
 */
export function subscribePosts(
  callback: (posts: HostedPost[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;
  return onSnapshot(
    collection(db, COL),
    (snap) => {
      const list: HostedPost[] = [];
      snap.forEach((d) => list.push(mapPost(d.id, d.data() as Record<string, unknown>)));
      list.sort(sortPostsForAdmin);
      callback(list);
    },
    (err) => {
      console.error("[subscribePosts]", err);
      onError?.(err instanceof Error ? err : new Error(String(err)));
    },
  );
}

/** Published posts only — `where` avoids leaking drafts under security rules. */
export function subscribePublishedPosts(callback: (posts: HostedPost[]) => void): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;
  const q = query(collection(db, COL), where("published", "==", true));
  return onSnapshot(
    q,
    (snap) => {
      const list: HostedPost[] = [];
      snap.forEach((d) => list.push(mapPost(d.id, d.data() as Record<string, unknown>)));
      list.sort((a, b) => a.order - b.order);
      callback(list);
    },
    () => callback([]),
  );
}

export async function createPost(input: {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  published: boolean;
  order: number;
}): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase não configurado");
  await addDoc(collection(db, COL), {
    title: input.title.trim(),
    slug: input.slug.trim().toLowerCase().replace(/\s+/g, "-"),
    excerpt: input.excerpt.trim(),
    body: input.body.trim(),
    published: input.published,
    order: input.order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePost(
  id: string,
  input: {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    published: boolean;
    order: number;
  },
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase não configurado");
  await updateDoc(doc(db, COL, id), {
    title: input.title.trim(),
    slug: input.slug.trim().toLowerCase().replace(/\s+/g, "-"),
    excerpt: input.excerpt.trim(),
    body: input.body.trim(),
    published: input.published,
    order: input.order,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase não configurado");
  await deleteDoc(doc(db, COL, id));
}

/** Starter content so the landing “Novidades” section matches admin immediately. */
export async function createExamplePublishedPost(): Promise<void> {
  await createPost({
    title: "Bem-vindo à Divas",
    slug: "bem-vindo-divas",
    excerpt: "Primeira publicação de exemplo — edite ou apague no painel.",
    body:
      "Este texto veio do painel administrativo (coleção **posts** no Firestore).\n\nMarque **Publicado no site** ao criar ou editar uma publicação para aparecer na página inicial.",
    published: true,
    order: 0,
  });
}
