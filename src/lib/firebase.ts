import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDummyKeyForOfflineFirstMode12345',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'agniver.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'agniver',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'agniver.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '656652105097',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:656652105097:web:408fd97f235121b6769d58',
};

let app: FirebaseApp | any;
let auth: Auth | any;
let db: Firestore | any;
let googleProvider: GoogleAuthProvider | any;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn('Firebase não pôde ser inicializado online. Operando em modo offline local:', error);
  // Fallback seguro para evitar crashes na aplicação
  auth = {} as any;
  db = {} as any;
  googleProvider = {} as any;
}

export { auth, db, googleProvider };
export default app;
