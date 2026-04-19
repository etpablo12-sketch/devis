import type { User } from "firebase/auth";
import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { UserProfile, UserRole } from "../types/models";
import { getBootstrapAdminEmails } from "../lib/env";

const USERS = "users";

function mapUser(id: string, data: Record<string, unknown>): UserProfile {
  return {
    uid: id,
    name: (data.name as string) || "",
    email: (data.email as string) || "",
    role: (data.role as UserRole) || "user",
    createdAt: (data.createdAt as UserProfile["createdAt"]) ?? null,
  };
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  return mapUser(snap.id, snap.data() as Record<string, unknown>);
}

export async function createUserProfile(uid: string, name: string, email: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  const bootstrap = getBootstrapAdminEmails();
  const role: UserRole = bootstrap.includes(email.toLowerCase()) ? "admin" : "user";
  await setDoc(doc(db, USERS, uid), {
    uid,
    name,
    email,
    role,
    createdAt: serverTimestamp(),
  });
}

/**
 * Load or create the Firestore profile; never throws (returns null if Firestore is unreachable).
 * Used so auth bootstrap cannot hang the UI forever.
 */
export async function resolveUserProfileSafe(user: User): Promise<UserProfile | null> {
  try {
    return await ensureUserProfileFromAuthUser(user);
  } catch {
    try {
      return await fetchUserProfile(user.uid);
    } catch {
      return null;
    }
  }
}

export async function ensureUserProfileFromAuthUser(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): Promise<UserProfile | null> {
  const db = getDb();
  if (!db) return null;
  const ref = doc(db, USERS, user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return mapUser(snap.id, snap.data() as Record<string, unknown>);
  }
  const email = user.email || "";
  const name = user.displayName || email.split("@")[0] || "User";
  await createUserProfile(user.uid, name, email);
  const again = await getDoc(ref);
  if (!again.exists()) return null;
  return mapUser(again.id, again.data() as Record<string, unknown>);
}

function sortUsersByNewest(a: UserProfile, b: UserProfile): number {
  const ta = a.createdAt?.toMillis?.() ?? 0;
  const tb = b.createdAt?.toMillis?.() ?? 0;
  if (tb !== ta) return tb - ta;
  return (a.email || "").localeCompare(b.email || "");
}

/**
 * Live list of all user documents. Uses the whole collection (no `orderBy`) so missing
 * `createdAt` or indexes cannot break the admin table — sort is done in memory.
 */
export function subscribeUsers(
  callback: (users: UserProfile[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;
  return onSnapshot(
    collection(db, USERS),
    (snap) => {
      const list: UserProfile[] = [];
      snap.forEach((d) => list.push(mapUser(d.id, d.data() as Record<string, unknown>)));
      list.sort(sortUsersByNewest);
      callback(list);
    },
    (err) => {
      console.error("[subscribeUsers]", err);
      onError?.(err instanceof Error ? err : new Error(String(err)));
    },
  );
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  await updateDoc(doc(db, USERS, uid), { role });
}

export async function deleteUserDocument(uid: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  await deleteDoc(doc(db, USERS, uid));
}

export async function listUsersOnce(): Promise<UserProfile[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(collection(db, USERS));
  const list: UserProfile[] = [];
  snap.forEach((d) => list.push(mapUser(d.id, d.data() as Record<string, unknown>)));
  list.sort(sortUsersByNewest);
  return list;
}
