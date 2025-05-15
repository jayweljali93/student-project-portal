import React, { useEffect, useState, useRef } from 'react';
import { collection, addDoc, query, orderBy, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, serverTimestamp } from '../firebase'; // Adjust path if needed

const ChatWindow = ({ student }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, 'messages'), {
      studentId: student.id,
      sender: 'admin',
      message,
      timestamp: serverTimestamp(),
      read: true
    });
    setMessage('');
  };

  useEffect(() => {
  if (!student) return;

  const q = query(
    collection(db, 'messages'),
    where('studentId', '==', student.id),
    orderBy('timestamp')
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const msgs = snapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        if (data.sender === 'student' && !data.read) {
          updateDoc(doc(db, 'messages', docSnapshot.id), { read: true });
        }
        return { id: docSnapshot.id, ...data };
      });
      setMessages(msgs);
      setTimeout(scrollToBottom, 100);
    },
    (error) => {
      console.error("Error in chat message listener:", error);
      // Optionally display an error message to the user
    }
  );

  return () => unsubscribe();
}, [student]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src={student.avatar} alt={student.name} className="student-avatar" />
        <div className="student-name">{student.name}</div>
      </div>
      <div className="chat-body">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg ${msg.sender}`}>
              <div className="message-content">{msg.message}</div>
              <div className="timestamp">
                {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
