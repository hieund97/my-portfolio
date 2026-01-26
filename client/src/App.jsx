import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Public pages
import Home from './pages/public/Home';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminExperience from './pages/admin/Experience';
import AdminLogin from './pages/admin/Login';
import AdminMessages from './pages/admin/Messages';
import AdminProfile from './pages/admin/Profile';
import AdminProjects from './pages/admin/Projects';
import AdminSkills from './pages/admin/Skills';
import AdminSocial from './pages/admin/Social';

// Admin layout
import AdminLayout from './components/admin/AdminLayout';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="social" element={<AdminSocial />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
