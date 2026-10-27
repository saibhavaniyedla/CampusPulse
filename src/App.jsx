import React from 'react';

import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import About from './pages/About.jsx'
import Register from "./pages/Register";

import StudentHome from './pages/student/StudentHome.jsx'
import StudentProblems from './pages/student/StudentProblems.jsx'
import ReportProblem from './pages/student/ReportProblem.jsx'
import StudentProfile from './pages/student/StudentProfile.jsx'

import AdminHome from './pages/admin/AdminHome.jsx'
import AdminProblems from './pages/admin/AdminProblems.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'
import AdminRegister from './pages/AdminRegister.jsx'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="app-main flex-grow-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route
  path="/admin/register"
  element={
    <ProtectedRoute role="admin">
      <AdminRegister />
    </ProtectedRoute>
  }
/>

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/problems"
            element={
              <ProtectedRoute role="student">
                <StudentProblems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/report"
            element={
              <ProtectedRoute role="student">
                <ReportProblem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/problems"
            element={
              <ProtectedRoute role="admin">
                <AdminProblems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute role="admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
