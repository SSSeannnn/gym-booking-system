import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Classes from './pages/Classes';
import Schedule from './pages/Schedule';
import MyBookings from './pages/MyBookings';
import Membership from './pages/Membership';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ClassDetail from './pages/ClassDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRoute from './components/AdminRoute';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="classes" element={<Classes />} />
            <Route path="classes/:id" element={<ClassDetail />} />
            <Route
              path="schedule"
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="membership"
              element={
                <ProtectedRoute>
                  <Membership />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
