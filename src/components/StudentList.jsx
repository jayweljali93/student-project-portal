import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, onSnapshot,doc, getDoc } from 'firebase/firestore';
import './AdminChatbox.css';
import { IdCard } from 'lucide-react';

const StudentList = ({ onSelectStudent, selectedStudentId }) => {
  const db = getFirestore();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'));
  
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const studentIds = new Set();
      const messagesMap = {};
  
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        studentIds.add(data.studentId);
  
        if (data.sender === 'student' && !data.read) {
          messagesMap[data.studentId] = (messagesMap[data.studentId] || 0) + 1;
        }
      });
  
      // Fetch student details from 'users' collection
      const studentPromises = Array.from(studentIds).map(async (id) => {
        try {
          const userDocRef = doc(db, 'users', id);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
              id,
              name: userData.name || `Student ${id}`,
              avatar: userData.avatar || `https://via.placeholder.com/40`,
              unreadCount: messagesMap[id] || 0,
            };
          } else {
            return {
              id,
              name: `Unknown Student`,
              avatar: `https://via.placeholder.com/40`,
              unreadCount: messagesMap[id] || 0,
            };
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          return {
            id,
            name: `Error Loading`,
            avatar: `https://via.placeholder.com/40`,
            unreadCount: messagesMap[id] || 0,
          };
        }
      });
  
      const studentsData = await Promise.all(studentPromises);
      setStudents(studentsData);
    });
  
    return () => unsubscribe();
  }, []);
  

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