import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtMZd71LbyKk-gEQLA23t74rdDkcNW3lI",
  authDomain: "campuspulse-web.firebaseapp.com",
  projectId: "campuspulse-web",
  storageBucket: "campuspulse-web.firebasestorage.app",
  messagingSenderId: "994719161043",
  appId: "1:994719161043:web:2f61eb78d2550749891226",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;