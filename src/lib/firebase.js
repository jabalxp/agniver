import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB93JHyGCIHLJBlFcY3yZwWC4oFUp1SB7s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agniver.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agniver",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agniver.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "656652105097",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:656652105097:web:408fd97f235121b6769d58"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
