import React from 'react'
import { useNavigate } from 'react-router-dom'
import studentImg from '../assets/student.png'
import './Login.css' // 👈 import custom CSS

const Login = () => {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 login-container">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl flex overflow-hidden">
        
        {/* Image Side */}
        <div className="hidden md:block w-1/2 bg-gradient-to-t from-[#0ea5e9] to-[#3b82f6] p-6 flex items-center justify-center">
          <img
            src={studentImg}
            alt="Student"
            className="w-80 hover:scale-105 transition duration-300 drop-shadow-xl"
          />
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-10 text-white">
          <h2 className="login-title mb-2">🎓 Welcome Student</h2>
          <p className="login-subtitle text-blue-200 mb-8">Login to your project portal</p>

          <input
            type="text"
            placeholder="Email Address"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-gray-300 login-input focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-gray-300 login-input focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white login-button shadow-md"
          >
            Login
          </button>

          <p className="text-center text-gray-400 mt-6 login-footer">
            🚀 Built with ❤️ for Future Engineers
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
