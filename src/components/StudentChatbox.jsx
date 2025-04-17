import React, { useEffect, useState } from 'react';
import { collection, addDoc, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import './StudentChatbox.css';
import { db, serverTimestamp } from '../firebase'; // This is correct now

const StudentChatbox = ({ currentStudent }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, 'messages'), {
      studentId: currentStudent.id,
      sender: 'student',
      message,
      timestamp: serverTimestamp(),
      read: false
    });

    setMessage('');
  };

  useEffect(() => {
    if (!currentStudent || !currentStudent.id) return;

    const q = query(
      collection(db, 'messages'),
      where('studentId', '==', currentStudent.id),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentStudent]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="student-chatbox">
      {isChatOpen ? (
        <div className="student-chat-container">
          <div className="chat-header">
            <h3>Chat with Admin</h3>
            <button className="minimize-btn" onClick={() => setIsChatOpen(false)}>—</button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="no-messages">Start chatting with admin</div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.sender}`}>
                  <span className="sender">{msg.sender === 'student' ? 'You' : 'Admin'}</span>
                  <div className="message-content">{msg.message}</div>
                  <span className="timestamp">
                    {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
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
      ) : (
        <button className="chat-icon-student" onClick={() => setIsChatOpen(true)}>
          Chat with Admin
        </button>
      )}
    </div>
  );
};

export default StudentChatbox;
