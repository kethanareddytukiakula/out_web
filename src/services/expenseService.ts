import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type ExpenseCreateData = {
  outingId: string;
  category: string;
  amount: number;
  note: string;
};

export type ExpenseDocument = {
  id: string;
  userId: string;
  outingId: string;
  category: string;
  amount: number;
  note: string;
  createdAt: Timestamp | null;
};

export async function saveExpense(userId: string, data: ExpenseCreateData) {
  const expensesRef = collection(db, "expenses");
  const docRef = await addDoc(expensesRef, {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getExpensesForUser(userId: string): Promise<ExpenseDocument[]> {
  const expensesRef = collection(db, "expenses");
  const expensesQuery = query(
    expensesRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(expensesQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId as string,
      outingId: data.outingId as string,
      category: data.category as string,
      amount: data.amount as number,
      note: data.note as string,
      createdAt: (data.createdAt as Timestamp) || null,
    };
  });
}
