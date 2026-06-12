import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export type UserProfile = {
  uid: string;
  name: string;
  regNo: string;
  course: string;
  year: string;
  email: string;
  createdAt?: any;
};

export async function createUserDoc(uid: string, data: Omit<UserProfile, 'uid' | 'createdAt'>) {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, { uid, ...data, createdAt: serverTimestamp() });
}

export async function getUserDoc(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}
