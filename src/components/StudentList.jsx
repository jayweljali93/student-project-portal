import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, onSnapshot } from 'firebase/firestore';
import './AdminChatbox.css';

const StudentList = ({ onSelectStudent, selectedStudentId }) => {
  const db = getFirestore();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Get all students who have sent messages
    const q = query(collection(db, 'messages'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentIds = new Set();
      const messagesMap = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        studentIds.add(data.studentId);
        
        // Count unread messages for each student
        if (data.sender === 'student' && !data.read) {
          messagesMap[data.studentId] = (messagesMap[data.studentId] || 0) + 1;
        }
      });
      
      // Get student information
      const studentPromises = Array.from(studentIds).map(async (id) => {
        // In a real application, you'd fetch student data from a 'students' collection
        // For this example, we'll create mock data
        return {
          id,
          name: `Student ${id}`,
          avatar: `https://via.placeholder.com/40`,
          unreadCount: messagesMap[id] || 0
        };
      });
      
      Promise.all(studentPromises).then(setStudents);
    });
    
    return () => unsubscribe();
  }, [db]);

  return (
    <div className="student-list">
      <div className="list-header">Students</div>
      {students.length === 0 ? (
        <div className="no-students">No student messages</div>
      ) : (
        students.map(student => (
          <div 
            key={student.id} 
            className={`student-item ${selectedStudentId === student.id ? 'selected' : ''}`}
            onClick={() => onSelectStudent(student)}
          >
            <img src={student.avatar} alt={student.name} />
            <div className="student-info">
              <div className="student-name">{student.name}</div>
              {student.unreadCount > 0 && (
                <div className="unread-badge">{student.unreadCount}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentList;