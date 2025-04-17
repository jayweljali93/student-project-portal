import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq6gL4vAVcDsVGrMn8p6i92YZiBtUmcyU",
  authDomain: "student-project-portal.firebaseapp.com",
  projectId: "student-project-portal",
  storageBucket: "student-project-portal.firebasestorage.app",
  messagingSenderId: "75846071853",
  appId: "1:75846071853:web:eda12a126252632ca96aa4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { serverTimestamp };  // <-- Add this line

export default app;
