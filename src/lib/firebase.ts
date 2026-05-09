import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "agniver",
  appId: "1:656652105097:web:408fd97f235121b6769d58",
  storageBucket: "agniver.firebasestorage.app",
  apiKey: "AIzaSyB93JHyGCIHLJBlFcY3yZwWC4oFUp1SB7s",
  authDomain: "agniver.firebaseapp.com",
  messagingSenderId: "656652105097",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
