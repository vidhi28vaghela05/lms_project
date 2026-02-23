import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import CoursesPage from './pages/CoursesPage';
import ContactPage from './pages/ContactPage';

import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LessonViewer from './pages/LessonViewer';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import PaymentHistory from './pages/PaymentHistory';
import SkillGraphView from './pages/SkillGraphView';
import MyCourses from './pages/MyCourses';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccess from './pages/PaymentSuccess';
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
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout onLogout={logout}>
            <ProfilePage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/billing" element={
        <ProtectedRoute role="student">
          <MainLayout onLogout={logout}>
            <PaymentHistory />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout onLogout={logout}>
            {getDashboard()}
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/manage-users" element={
        <ProtectedRoute role="admin">
          <MainLayout onLogout={logout}>
            <AdminDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/system-stats" element={
        <ProtectedRoute role="admin">
          <MainLayout onLogout={logout}>
            <AdminDashboard />
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


      <Route path="/checkout/:courseId" element={
        <ProtectedRoute>
          <MainLayout onLogout={logout}>
            <CheckoutPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/payment-success" element={
        <ProtectedRoute>
          <MainLayout onLogout={logout}>
            <PaymentSuccess />
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

      <Route path="/about" element={<AboutUs />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/" element={<LandingPage />} />
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
