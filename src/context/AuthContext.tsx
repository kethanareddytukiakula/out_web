import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { signupAuth, loginAuth, logoutAuth } from "../services/authService";
import { createUserDoc, getUserDoc, type UserProfile } from "../services/userService";

type AuthContextValue = {
  currentUser: UserProfile | null;
  loading: boolean;
  signup: (payload: { name: string; regNo: string; course: string; year: string; email: string; password: string; }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        const doc = await getUserDoc(user.uid);
        setCurrentUser(doc);
      } catch (err) {
        console.error("Failed to load user document", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signup = async ({ name, regNo, course, year, email, password }: { name: string; regNo: string; course: string; year: string; email: string; password: string; }) => {
    const cred = await signupAuth(email, password);
    await createUserDoc(cred.user.uid, { name, regNo, course, year, email });
    const doc = await getUserDoc(cred.user.uid);
    setCurrentUser(doc);
  };

  const login = async (email: string, password: string) => {
    await loginAuth(email, password);
    // onAuthStateChanged handler will load user doc
  };

  const logout = async () => {
    await logoutAuth();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
