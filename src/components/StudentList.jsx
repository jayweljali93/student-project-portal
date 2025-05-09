import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  getDoc,
  doc,
} from 'firebase/firestore';
import './AdminChatbox.css';

const StudentList = ({ onSelectStudent, selectedStudentId }) => {
  const db = getFirestore();
  const [students, setStudents] = useState([]);
  

  useEffect(() => {
    const q = query(collection(db, 'messages'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const studentIds = new Set();
      const unreadMap = {};

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.studentId) {
          studentIds.add(data.studentId);
        }

        if (data.sender === 'student' && !data.read && data.studentId) {
          unreadMap[data.studentId] = (unreadMap[data.studentId] || 0) + 1;
        }
      });

      const studentPromises = Array.from(studentIds).map(async (id) => {
        try {
          const studentDoc = await getDoc(doc(db, 'users', id)); // or 'students' if you saved there
          if (studentDoc.exists()) {
            const userData = studentDoc.data();
            return {
              id,
              name: userData.name || userData.email?.split('@')[0] || 'Unknown',
              avatar: 'https://via.placeholder.com/40',
              unreadCount: unreadMap[id] || 0,
            };
          } else {
            return {
              id,
              name: id,
              avatar: 'https://via.placeholder.com/40',
              unreadCount: unreadMap[id] || 0,
            };
          }
        } catch (err) {
          console.error('Error fetching student:', id, err);
          return null;
        }
      });

      const results = await Promise.all(studentPromises);
      setStudents(results.filter((s) => s !== null));
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <div className="student-list">
      <div className="list-header">Students</div>
      {students.length === 0 ? (
        <div className="no-students">No student messages</div>
      ) : (
        students.map((student) => (
          <div
            key={student.id}
            className={`student-item ${selectedStudentId === student.id ? 'selected' : ''}`}
            onClick={() => onSelectStudent(student)}
          >
            {/* <img src={student.avatar} alt={student.name} /> */}
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
