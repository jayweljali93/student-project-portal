// src/components/ProjectCard.jsx
import React from 'react'
import { Code2 } from 'lucide-react'

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl text-white hover:scale-105 transition transform">
      <div className="flex items-center gap-2 mb-3">
        <Code2 className="text-blue-300" />
        <h2 className="text-xl font-semibold">{project.title}</h2>
      </div>
      <p className="text-sm text-gray-200">{project.description}</p>
      <div className="mt-4">
        <span className="text-xs bg-blue-400/20 text-blue-100 px-3 py-1 rounded-full">
          {project.techStack}
        </span>
      </div>
      <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl">
        Request This Project
      </button>
    </div>
  )
}

export default ProjectCard
