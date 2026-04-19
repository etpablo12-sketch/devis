/** Map Firebase Auth error codes to user-facing messages (PT-BR) */
export function mapAuthError(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-disabled": "Esta conta foi desativada.",
    "auth/user-not-found": "Não encontramos uma conta com este e-mail.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/weak-password": "Use uma senha mais forte (mínimo 8 caracteres).",
    "auth/network-request-failed": "Erro de rede. Tente novamente.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um momento.",
    "auth/popup-closed-by-user": "Login cancelado.",
    "auth/account-exists-with-different-credential": "Este e-mail já está vinculado a outro provedor.",
    "auth/operation-not-allowed":
      "Este método de login não está ativado no Firebase (Console → Authentication → Sign-in method).",
  };
  return map[code] || "Não foi possível concluir a operação. Tente novamente.";
}
