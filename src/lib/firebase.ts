import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB93JHyGCIHLJBlFcY3yZwWC4oFUp1SB7s",
  authDomain: "agniver.firebaseapp.com",
  projectId: "agniver",
  storageBucket: "agniver.firebasestorage.app",
  messagingSenderId: "656652105097",
  appId: "1:656652105097:web:408fd97f235121b6769d58"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
export default app;
