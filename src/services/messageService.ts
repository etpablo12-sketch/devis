import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { MessageStatus, SupportMessage } from "../types/models";

const COL = "messages";

function mapMessage(id: string, data: Record<string, unknown>): SupportMessage {
  return {
    id,
    userId: (data.userId as string | null) ?? null,
    name: (data.name as string) || "",
    email: (data.email as string) || "",
    message: (data.message as string) || "",
    status: (data.status as MessageStatus) || "pending",
    createdAt: (data.createdAt as SupportMessage["createdAt"]) ?? null,
  };
}

export async function submitMessage(input: {
  userId: string | null;
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase não configurado");
  await addDoc(collection(db, COL), {
    userId: input.userId === null ? null : input.userId,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
    status: "pending" as MessageStatus,
    createdAt: serverTimestamp(),
  });
}

/** Streams all messages (newest first). Filter status in UI to avoid composite indexes. */
export function subscribeMessages(callback: (messages: SupportMessage[]) => void): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const list: SupportMessage[] = [];
    snap.forEach((d) => list.push(mapMessage(d.id, d.data() as Record<string, unknown>)));
    callback(list);
  });
}

export async function updateMessageStatus(id: string, status: MessageStatus): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase não configurado");
  await updateDoc(doc(db, COL, id), { status });
}

export async function deleteMessage(id: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase não configurado");
  await deleteDoc(doc(db, COL, id));
}

export async function listMessagesOnce(): Promise<SupportMessage[]> {
  const db = getDb();
  if (!db) return [];
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const list: SupportMessage[] = [];
  snap.forEach((d) => list.push(mapMessage(d.id, d.data() as Record<string, unknown>)));
  return list;
}
