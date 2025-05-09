import React from 'react';
import '../styles/ProfileSection.css';
import { getAuth } from 'firebase/auth';

const ProfileSection = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <div className="profile-icon-wrapper">
      <img
        src="https://i.pravatar.cc/100?img=68"
        alt="Profile Icon"
        className="profile-icon"
      />
      <div className="profile-popup">
        <img
          src="https://i.pravatar.cc/100?img=68"
          alt="Full Profile"
          className="profile-popup-avatar"
        />
        <h4>{user?.displayName || "Student"}</h4>
        <p>{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfileSection;
