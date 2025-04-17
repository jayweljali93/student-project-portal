// AdminChatbox.jsx
import React, { useState } from "react";
import StudentList from "./StudentList";
import ChatWindow from "./ChatWindow";
import './AdminChatbox.css';

const AdminChatbox = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="admin-chatbox">
      <button className="chat-icon" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {isOpen && (
        <div className="chat-container">
          <StudentList 
            onSelectStudent={handleStudentSelect} 
            selectedStudentId={selectedStudent?.id}
          />
          
          {selectedStudent ? (
            <ChatWindow student={selectedStudent} />
          ) : (
            <div className="chat-window no-student">
              <div className="chat-header">Student Chat</div>
              <div className="chat-body">
                <p className="select-prompt">
                  Select a student to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminChatbox;