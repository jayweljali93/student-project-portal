import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // ✅ Import this

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq6gL4vAVcDsVGrMn8p6i92YZiBtUmcyU",
  authDomain: "student-project-portal.firebaseapp.com",
  projectId: "student-project-portal",
  storageBucket: "student-project-portal.appspot.com",
  messagingSenderId: "75846071853",
  appId: "1:75846071853:web:eda12a126252632ca96aa4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize Firebase Storage

export { auth, db, storage, serverTimestamp };
