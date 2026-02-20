import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LessonViewer from './pages/LessonViewer';
import QuizPage from './pages/QuizPage';
import SkillGraphView from './pages/SkillGraphView';
import MyCourses from './pages/MyCourses';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { user, logout } = useAuth();

  const getDashboard = () => {
    if (user?.role === 'student') return <StudentDashboard />;
    if (user?.role === 'instructor') return <InstructorDashboard />;
    if (user?.role === 'admin') return <AdminDashboard />;
    return <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout onLogout={logout}>
            {getDashboard()}
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/my-courses" element={
        <ProtectedRoute role="student">
          <MainLayout onLogout={logout}>
            <MyCourses />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/skill-graph" element={
        <ProtectedRoute role="student">
          <MainLayout onLogout={logout}>
            <SkillGraphView />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/lessons/:courseId" element={
        <ProtectedRoute>
          <MainLayout onLogout={logout}>
            <LessonViewer />
          </MainLayout>
        </ProtectedRoute>
      } />


      <Route path="/quiz/:courseId" element={
        <ProtectedRoute>
          <MainLayout onLogout={logout}>
            <QuizPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
