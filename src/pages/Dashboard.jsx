// src/pages/Dashboard.jsx
import React from 'react'
import Navbar from '../components/Navbar'
import ProjectCard from '../components/ProjectCard'
import './Dashboard.css' // ✅ import the new CSS

const dummyProjects = [
  {
    id: 1,
    title: 'Online Voting System',
    description: 'A secure platform to conduct college elections online.',
    techStack: 'React, Node.js, MongoDB',
  },
  {
    id: 2,
    title: 'Library Management System',
    description: 'Manage book inventory and student issuance records.',
    techStack: 'Java, MySQL',
  },
  {
    id: 3,
    title: 'Mental Health Tracker',
    description: 'Track mood and suggest activities based on AI.',
    techStack: 'Flutter, Firebase',
  },
]

const Dashboard = () => {
  return (
    <div className="bg-gradient-to-r from-[#1e3c72] via-[#2a5298] to-[#1e3c72] min-h-screen dashboard-container">
      <Navbar />
      <div className="p-8">
        <h2 className="dashboard-heading">✨ Explore Exclusive Projects</h2>
        <div className="project-grid">
          {dummyProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
