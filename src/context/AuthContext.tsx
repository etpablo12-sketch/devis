import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "../services/firebase";
import { createUserProfile, fetchUserProfile, resolveUserProfileSafe } from "../services/userService";
import type { UserProfile } from "../types/models";

type AuthState = {
  firebaseReady: boolean;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<UserProfile | null>;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const firebaseReady = isFirebaseConfigured();

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    const auth = getFirebaseAuth();
    const u = auth?.currentUser;
    if (!u) {
      setProfile(null);
      return null;
    }
    const p = await resolveUserProfileSafe(u);
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (next: User | null) => {
      setUser(next);
      if (!next) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const p = await resolveUserProfileSafe(next);
      setProfile(p);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase não configurado");
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signUpEmail = useCallback(async (name: string, email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase não configurado");
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await createUserProfile(cred.user.uid, name.trim(), cred.user.email || email.trim());
    const p = await fetchUserProfile(cred.user.uid);
    setProfile(p);
    return p;
  }, []);

  const signInGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase não configurado");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  }, []);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase não configurado");
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      firebaseReady,
      user,
      profile,
      loading,
      signInEmail,
      signUpEmail,
      signInGoogle,
      logout,
      resetPassword,
      refreshProfile,
    }),
    [
      firebaseReady,
      user,
      profile,
      loading,
      signInEmail,
      signUpEmail,
      signInGoogle,
      logout,
      resetPassword,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
