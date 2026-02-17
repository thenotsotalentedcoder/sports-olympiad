import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { initializeMockData } from './data/mockData';
import { isAuthenticated, isAdmin, isUniversity } from './utils/auth';

import HomePage from './components/HomePage';
import Login from './components/Login';
import UniversityDashboard from './components/UniversityDashboard';
import RegistrationForm from './components/RegistrationForm';
import RegistrationDetails from './components/RegistrationDetails';
import AdminDashboard from './components/AdminDashboard';
import AdminReview from './components/AdminReview';

// Protected Route Components
const ProtectedRoute = ({ children, requireAdmin = false, requireUniversity = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/admin/login" />;
  }

  if (requireUniversity && !isUniversity()) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  useEffect(() => {
    // Initialize mock data on app load
    initializeMockData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login isAdmin={true} />} />

        {/* University Routes */}
        <Route
          path="/university/dashboard"
          element={
            <ProtectedRoute requireUniversity={true}>
              <UniversityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/register"
          element={
            <ProtectedRoute requireUniversity={true}>
              <RegistrationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/register/:id"
          element={
            <ProtectedRoute requireUniversity={true}>
              <RegistrationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university/registration/:id"
          element={
            <ProtectedRoute requireUniversity={true}>
              <RegistrationDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/review/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminReview />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
