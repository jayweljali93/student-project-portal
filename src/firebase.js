// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBq6gL4vAVcDsVGrMn8p6i92YZiBtUmcyU",
//   authDomain: "student-project-portal.firebaseapp.com",
//   projectId: "student-project-portal",
//   storageBucket: "student-project-portal.firebasestorage.app",
//   messagingSenderId: "75846071853",
//   appId: "1:75846071853:web:eda12a126252632ca96aa4",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// export { auth, db, storage };
// export default app;

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export default app;