import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type OutingCreateData = {
  location: string;
  category: string;
  amount: number;
};

export type OutingDocument = {
  id: string;
  userId: string;
  location: string;
  category: string;
  amount: number;
  createdAt: Timestamp | null;
};

export async function saveOuting(userId: string, data: OutingCreateData) {
  const outingsRef = collection(db, "outings");
  await addDoc(outingsRef, {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getOutingsForUser(userId: string): Promise<OutingDocument[]> {
  const outingsRef = collection(db, "outings");
  const outingsQuery = query(
    outingsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(outingsQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId as string,
      location: data.location as string,
      category: data.category as string,
      amount: data.amount as number,
      createdAt: (data.createdAt as Timestamp) || null,
    };
  });
}
