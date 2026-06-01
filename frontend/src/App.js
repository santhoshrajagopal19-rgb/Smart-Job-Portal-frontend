import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import JobListingsPage from './pages/JobListingsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Dynamic dashboard route based on user role
const DynamicDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'candidate') {
    return <CandidateDashboard />;
  } else if (user.role === 'recruiter') {
    return <RecruiterDashboard />;
  } else if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <AuthPage isLogin={true} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <AuthPage isLogin={false} />
              </PublicOnlyRoute>
            }
          />

          {/* Protected application routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobListingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId"
            element={
              <ProtectedRoute>
                <JobDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DynamicDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
