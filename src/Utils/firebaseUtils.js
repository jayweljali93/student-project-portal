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
  serverTimestamp as _serverTimestamp,
} from "firebase/firestore";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBq6gL4vAVcDsVGrMn8p6i92YZiBtUmcyU",
  authDomain: "student-project-portal.firebaseapp.com",
  projectId: "student-project-portal",
  storageBucket: "student-project-portal.appspot.com",
  messagingSenderId: "75846071853",
  appId: "1:75846071853:web:eda12a126252632ca96aa4",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firestore instance
const db = getFirestore(app);

// ✅ Correct timestamp function
export const serverTimestamp = () => _serverTimestamp();

// ✅ Export db
export { db };

// ✅ Send message
export const sendMessageToFirebase = async ({ studentId, sender, message }) => {
  if (!message || !message.trim()) return;

  await addDoc(collection(db, "messages"), {
    studentId,
    sender,
    message,
    timestamp: serverTimestamp(),
    read: sender === "admin" ? true : false,
  });
};

// ✅ Listen to messages
export const listenToMessages = (studentId, callback) => {
  const q = query(
    collection(db, "messages"),
    where("studentId", "==", studentId),
    orderBy("timestamp")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);

    // Mark messages read
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.sender === "student" && !data.read) {
        updateDoc(doc(db, "messages", docSnap.id), { read: true });
      }
    });
  });
};
