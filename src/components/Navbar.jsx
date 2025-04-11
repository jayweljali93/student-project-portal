// src/components/Navbar.jsx
import React from 'react'
import { LogOut } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="backdrop-blur-md bg-white/30 shadow-md p-4 flex justify-between items-center border-b border-white/20">
      <h1 className="text-2xl font-bold text-white drop-shadow">🎓 Project Portal</h1>
      <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow">
        <LogOut size={18} /> Logout
      </button>
    </nav>
  )
}

export default Navbar
