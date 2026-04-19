import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { formatFirestoreTime } from "../../lib/formatFirestoreTime";
import { isFirebaseConfigured } from "../../services/firebase";
import { deleteUserDocument, subscribeUsers, updateUserRole } from "../../services/userService";
import type { UserProfile, UserRole } from "../../types/models";

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listReady, setListReady] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoadError("Firebase não configurado (.env).");
      setListReady(true);
      return;
    }
    const unsub = subscribeUsers(
      (list) => {
        setUsers(list);
        setLoadError(null);
        setListReady(true);
      },
      (err) => {
        setLoadError(err.message || "Erro ao ler utilizadores.");
        setListReady(true);
        toast.error("Firestore: não foi possível carregar utilizadores.");
      },
    );
    return () => unsub?.();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.uid.toLowerCase().includes(q),
    );
  }, [users, query]);

  async function handleRole(uid: string, role: UserRole) {
    setBusyId(uid);
    try {
      await updateUserRole(uid, role);
      toast.success("Função atualizada.");
    } catch {
      toast.error("Não foi possível atualizar.");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.uid);
    try {
      await deleteUserDocument(deleteTarget.uid);
      toast.success("Documento do usuário removido no Firestore.");
      toast.message("Obs.: a conta no Authentication deve ser removida no Console Firebase se necessário.", {
        duration: 6000,
      });
    } catch {
      toast.error("Falha ao remover.");
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Usuários</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Lista em tempo real da coleção <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">users</code> — mesmos
        dados que o login e o perfil usam.
      </p>

      {loadError && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {loadError}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative max-w-md flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Filtrar por nome, e-mail ou UID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            aria-label="Filtrar utilizadores"
          />
        </div>
        <p className="text-sm text-zinc-500">
          {listReady ? (
            <>
              <strong className="text-zinc-800 dark:text-zinc-200">{filtered.length}</strong> mostrados
              {query.trim() ? ` (${users.length} no total)` : ""}
            </>
          ) : (
            "A carregar…"
          )}
        </p>
      </div>

      <Card padding="none" className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Nome</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">E-mail</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">UID</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Registo</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Função</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {!listReady ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                    A carregar utilizadores…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                    {users.length === 0 ? "Nenhum documento em users ainda — faça um registo no site." : "Nenhum resultado para o filtro."}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.uid} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{u.name || "—"}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{u.email}</td>
                    <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs text-zinc-500" title={u.uid}>
                      {u.uid}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-500">{formatFirestoreTime(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                        value={u.role}
                        disabled={busyId === u.uid}
                        onChange={(e) => handleRole(u.uid, e.target.value as UserRole)}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => setDeleteTarget(u)}>
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Excluir usuário (Firestore)?">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Remove o documento de <strong>{deleteTarget?.email}</strong>. A conta em Authentication não é removida
          automaticamente.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={confirmDelete} isLoading={busyId === deleteTarget?.uid}>
            Excluir documento
          </Button>
        </div>
      </Modal>
    </div>
  );
}
