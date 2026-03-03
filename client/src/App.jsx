import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ADMIN_PATH } from './constants';
import { useAuth } from './contexts/AuthContext';

// Public pages - Home is eager (critical path)
import Home from './pages/public/Home';

// Lazy-loaded pages (code splitting)
const Pricing = lazy(() => import('./pages/public/Pricing'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminExperience = lazy(() => import('./pages/admin/Experience'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminProfile = lazy(() => import('./pages/admin/Profile'));
const AdminProjects = lazy(() => import('./pages/admin/Projects'));
const AdminSkills = lazy(() => import('./pages/admin/Skills'));
const AdminSocial = lazy(() => import('./pages/admin/Social'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));

// Shared loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${ADMIN_PATH}/login`} replace />;
  }

  return children;
};

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Admin routes */}
      <Route path={`/${ADMIN_PATH}/login`} element={<AdminLogin />} />
      <Route
        path={`/${ADMIN_PATH}`}
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
    </Suspense>
  );
}

export default App;

