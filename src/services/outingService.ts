import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, Timestamp, doc, updateDoc, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type OutingCreateData = {
  location: string;
  category: string;
  startTime: Timestamp;
  endTime: Timestamp | null;
  duration: number;
  status: "active" | "completed";
};

export type OutingDocument = {
  id: string;
  userId: string;
  location: string;
  category: string;
  startTime: Timestamp;
  endTime: Timestamp | null;
  duration: number;
  status: "active" | "completed";
  createdAt: Timestamp | null;
};

export async function saveOuting(userId: string, data: OutingCreateData) {
  const outingsRef = collection(db, "outings");
  const docRef = await addDoc(outingsRef, {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateOuting(outingId: string, data: Partial<OutingCreateData>) {
  const docRef = doc(db, "outings", outingId);
  await updateDoc(docRef, data);
}

export async function getActiveOutingForUser(userId: string): Promise<OutingDocument | null> {
  const outingsRef = collection(db, "outings");
  const outingsQuery = query(
    outingsRef,
    where("userId", "==", userId),
    where("status", "==", "active")
  );
  const snapshot = await getDocs(outingsQuery);
  if (snapshot.empty) return null;
  
  const docs = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId as string,
      location: data.location as string,
      category: data.category as string,
      startTime: data.startTime as Timestamp,
      endTime: (data.endTime as Timestamp) || null,
      duration: data.duration as number,
      status: data.status as "active" | "completed",
      createdAt: (data.createdAt as Timestamp) || null,
    };
  });

  const getSortTime = (d: any) => {
    if (d.createdAt) return d.createdAt.toMillis();
    if (d.startTime) return d.startTime.toMillis();
    return 0;
  };

  docs.sort((a, b) => getSortTime(b) - getSortTime(a));
  return docs[0];
}

export async function getOutingsForUser(userId: string): Promise<OutingDocument[]> {
  const outingsRef = collection(db, "outings");
  const outingsQuery = query(
    outingsRef,
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(outingsQuery);
  const docs = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId as string,
      location: data.location as string,
      category: data.category as string,
      startTime: data.startTime as Timestamp,
      endTime: (data.endTime as Timestamp) || null,
      duration: data.duration as number,
      status: data.status as "active" | "completed",
      createdAt: (data.createdAt as Timestamp) || null,
    };
  });

  const getSortTime = (d: any) => {
    if (d.createdAt) return d.createdAt.toMillis();
    if (d.startTime) return d.startTime.toMillis();
    return 0;
  };

  docs.sort((a, b) => getSortTime(b) - getSortTime(a));
  return docs;
}

