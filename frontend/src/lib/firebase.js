import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAqF2Gwluam2LjwbnnJdGAKNNJakfRkbI4",
  authDomain: "simple-diary-7c0a4.firebaseapp.com",
  projectId: "simple-diary-7c0a4",
  storageBucket: "simple-diary-7c0a4.firebasestorage.app",
  messagingSenderId: "365755293265",
  appId: "1:365755293265:web:f54958c012e082068fa270",
  measurementId: "G-ZPFXYJ0GT4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
