import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { TextField } from "../../components/ui/TextField";
import { slugify } from "../../lib/slugify";
import {
  createExamplePublishedPost,
  createPost,
  deletePost,
  subscribePosts,
  updatePost,
} from "../../services/hostedPostsService";
import { isFirebaseConfigured } from "../../services/firebase";
import type { HostedPost } from "../../types/models";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  published: false,
  order: 0,
};

export function AdminPostsPage() {
  const [posts, setPosts] = useState<HostedPost[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HostedPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<HostedPost | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listReady, setListReady] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoadError("Firebase não configurado (.env).");
      setListReady(true);
      return;
    }
    const unsub = subscribePosts(
      (list) => {
        setPosts(list);
        setLoadError(null);
        setListReady(true);
      },
      (err) => {
        setLoadError(err.message || "Erro ao ler publicações.");
        setListReady(true);
        toast.error("Firestore: não foi possível carregar posts.");
      },
    );
    return () => unsub?.();
  }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm, order: posts.length });
    setOpen(true);
  }

  function openEdit(p: HostedPost) {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      body: p.body,
      published: p.published,
      order: p.order,
    });
    setOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Informe o título.");
      return;
    }
    const slug = form.slug.trim() || slugify(form.title);
    setBusy(true);
    try {
      if (editing) {
        await updatePost(editing.id, { ...form, slug });
        toast.success("Publicação atualizada.");
      } else {
        await createPost({ ...form, slug });
        toast.success("Publicação criada.");
      }
      setOpen(false);
    } catch {
      toast.error("Falha ao guardar.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(p: HostedPost) {
    setBusy(true);
    try {
      await updatePost(p.id, {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        body: p.body,
        published: !p.published,
        order: p.order,
      });
      toast.success(!p.published ? "Publicado no site." : "Marcado como rascunho.");
    } catch {
      toast.error("Não foi possível atualizar.");
    } finally {
      setBusy(false);
    }
  }

  async function addExamplePost() {
    setBusy(true);
    try {
      await createExamplePublishedPost();
      toast.success("Publicação de exemplo criada — veja Novidades na página inicial.");
    } catch {
      toast.error("Não foi possível criar o exemplo (regras Firestore ou rede).");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deletePost(deleting.id);
      toast.success("Removido.");
      setDeleting(null);
    } catch {
      toast.error("Não foi possível remover.");
    } finally {
      setBusy(false);
    }
  }

  const publishedCount = posts.filter((x) => x.published).length;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Publicações</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Mesma coleção Firestore <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">posts</code> que alimenta a secção{" "}
            <strong>Novidades</strong> na página inicial (só entradas com &quot;Publicado&quot;).
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link
              to="/#novidades"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Ver no site
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </Link>
            <span className="text-sm text-zinc-500">
              {listReady ? (
                <>
                  <strong className="text-zinc-800 dark:text-zinc-200">{posts.length}</strong> no painel ·{" "}
                  <strong className="text-emerald-700 dark:text-emerald-400">{publishedCount}</strong> visíveis no site
                </>
              ) : (
                "A carregar…"
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {posts.length === 0 && listReady && !loadError && (
            <Button type="button" variant="outline" isLoading={busy} onClick={addExamplePost}>
              Inserir publicação de exemplo
            </Button>
          )}
          <Button type="button" onClick={openNew}>
            Nova publicação
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {loadError}
        </div>
      )}

      <Card padding="none" className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Ordem</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Título</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Slug</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Estado</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">No site</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {!listReady ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                    A carregar publicações…
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                    Nenhuma publicação. Use <strong>Nova publicação</strong> ou <strong>Inserir publicação de exemplo</strong>.
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                    <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">{p.order}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{p.title}</td>
                    <td className="px-4 py-3 text-zinc-500">{p.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.published ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {p.published ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => togglePublished(p)}>
                        {p.published ? "Despublicar" : "Publicar"}
                      </Button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => openEdit(p)}>
                          Editar
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleting(p)}>
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Editar publicação" : "Nova publicação"}
        className="max-h-[90vh] max-w-2xl overflow-y-auto"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            id="post-title"
            label="Título"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <TextField
            id="post-slug"
            label="Slug (URL)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
          <TextField id="post-excerpt" label="Resumo" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
          <div>
            <label htmlFor="post-body" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Corpo (texto ou HTML simples)
            </label>
            <textarea
              id="post-body"
              rows={10}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="post-order"
              label="Ordem"
              type="number"
              value={String(form.order)}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))}
            />
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="h-4 w-4 rounded border-zinc-300 text-primary-600 focus:ring-primary-500"
                />
                Publicado no site (Novidades)
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={busy}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Excluir publicação?">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Remover <strong>{deleting?.title}</strong> permanentemente?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => setDeleting(null)}>
            Cancelar
          </Button>
          <Button type="button" className="bg-red-600 hover:bg-red-700" isLoading={busy} onClick={confirmDelete}>
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  );
}
