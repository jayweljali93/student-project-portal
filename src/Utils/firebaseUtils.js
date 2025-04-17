// firebaseUtils.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp as _serverTimestamp
} from "firebase/firestore";

// Your Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyBq6gL4vAVcDsVGrMn8p6i92YZiBtUmcyU",
    authDomain: "student-project-portal.firebaseapp.com",
    projectId: "student-project-portal",
    storageBucket: "student-project-portal.firebasestorage.app",
    messagingSenderId: "75846071853",
    appId: "1:75846071853:web:eda12a126252632ca96aa4",
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firestore instance
const db = getFirestore(app);

// Export Firestore instance and timestamp
export { db, _serverTimestamp as serverTimestamp };

// Send message to Firebase
export const sendMessageToFirebase = async ({ studentId, sender, message }) => {
  if (!message.trim()) return;

  await addDoc(collection(db, "messages"), {
    studentId,
    sender,
    message,
    timestamp: _serverTimestamp(),
    read: sender === "admin" ? true : false
  });
};

// Listen to messages in real-time
export const listenToMessages = (studentId, callback) => {
  const q = query(
    collection(db, "messages"),
    where("studentId", "==", studentId),
    orderBy("timestamp")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);

    // Mark unread messages as read (if viewed by admin)
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      if (data.sender === "student" && !data.read) {
        updateDoc(doc(db, "messages", docSnap.id), { read: true });
      }
    });
  });
};
