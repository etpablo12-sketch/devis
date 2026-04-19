import { FirebaseError } from "firebase/app";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ThemeToggle } from "../../components/layout/ThemeToggle";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { TextField } from "../../components/ui/TextField";
import { useAuth } from "../../context/AuthContext";
import { mapAuthError } from "../../services/authErrors";
import { isFirebaseConfigured } from "../../services/firebase";

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isFirebaseConfigured()) {
      toast.error("Configure o Firebase em .env.");
      return;
    }
    const em = email.trim();
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(em);
      setSent(true);
      toast.success("Enviamos o link para redefinir a senha.");
    } catch (err: unknown) {
      const code = err instanceof FirebaseError ? err.code : "";
      toast.error(code ? mapAuthError(code) : "Não foi possível enviar o e-mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800">
        <Link to="/login" className="text-sm font-medium text-primary-600 dark:text-primary-400">
          ← Voltar ao login
        </Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Recuperar senha</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Enviaremos um link para o seu e-mail para definir uma nova senha.
        </p>

        <Card padding="lg" className="mt-8">
          {sent ? (
            <p className="text-center text-sm text-zinc-700 dark:text-zinc-300">
              Se existir uma conta para <strong>{email}</strong>, você receberá o e-mail em instantes.
            </p>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <TextField
                id="fp-email"
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Button type="submit" className="w-full" isLoading={loading}>
                Enviar link
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
