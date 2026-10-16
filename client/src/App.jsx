import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PracticeLibrary from './pages/PracticeLibrary';
import AddProblem from './pages/AddProblem';
import ProblemDetails from './pages/ProblemDetails';
import PracticeSession from './pages/PracticeSession';
import Recommendations from './pages/Recommendations';
import ReviewQueue from './pages/ReviewQueue';
import Analytics from './pages/Analytics';
import PracticeHistory from './pages/PracticeHistory';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import PatternMap from './pages/PatternMap';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading PracticeLab session...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><PracticeLibrary /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><PatternMap /></ProtectedRoute>} />
      <Route path="/add-problem" element={<ProtectedRoute><AddProblem /></ProtectedRoute>} />
      <Route path="/problem/:id" element={<ProtectedRoute><ProblemDetails /></ProtectedRoute>} />
      <Route path="/practice/:id" element={<ProtectedRoute><PracticeSession /></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
      <Route path="/reviews" element={<ProtectedRoute><ReviewQueue /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><PracticeHistory /></ProtectedRoute>} />
      <Route path="/archive" element={<ProtectedRoute><Archive /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
