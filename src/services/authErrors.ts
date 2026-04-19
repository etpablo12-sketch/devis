/** Map Firebase Auth error codes to user-facing messages */
export function mapAuthError(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-email": "Invalid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "We couldn't find an account with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/email-already-in-use": "That email is already registered.",
    "auth/weak-password": "Use a stronger password (at least 8 characters).",
    "auth/network-request-failed": "Network error. Please try again.",
    "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/account-exists-with-different-credential": "This email is already linked to another sign-in method.",
    "auth/operation-not-allowed":
      "This sign-in method is not enabled in Firebase (Console → Authentication → Sign-in method).",
  };
  return map[code] || "Something went wrong. Please try again.";
}
