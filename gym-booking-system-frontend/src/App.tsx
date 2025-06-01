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
import AdminLayout from './layouts/AdminLayout';
import NotFound from './pages/NotFound';
import ClassManagement from './pages/admin/ClassManagement';
import ClassForm from './pages/admin/ClassForm';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import ScheduleForm from './pages/admin/ScheduleForm';
import UserManagement from './pages/admin/UserManagement';
import UserForm from './pages/admin/UserForm';
import InstructorSchedulesPage from './pages/InstructorSchedulesPage';

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
              path="instructor/schedules"
              element={
                <ProtectedRoute>
                  <InstructorSchedulesPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="classes" element={<ClassManagement />} />
            <Route path="classes/new" element={<ClassForm />} />
            <Route path="classes/:id/edit" element={<ClassForm />} />
            <Route path="schedules" element={<ScheduleManagement />} />
            <Route path="schedules/new" element={<ScheduleForm />} />
            <Route path="schedules/:id/edit" element={<ScheduleForm />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/edit/:userId" element={<UserForm />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
