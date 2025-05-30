import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../utils/axios';
import {
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface User {
  _id: string;
  role: string;
}

interface Class {
  id: string;
  name: string;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();

  // Fetch users for statistics
  const { data: usersResponse } = useQuery<ApiResponse<User[]>>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('/users');
      return response.data;
    },
  });

  // Fetch classes for statistics
  const { data: classesResponse } = useQuery<ApiResponse<Class[]>>({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await axios.get('/classes');
      return response.data;
    },
  });

  // 获取所有排班
  const { data: schedulesResponse } = useQuery({
    queryKey: ['schedules', 'dashboard'],
    queryFn: async () => {
      const response = await axios.get('/schedules');
      return response.data;
    },
  });

  const users = usersResponse?.data || [];
  const classes = classesResponse?.data || [];
  const customerCount = users.filter(user => user.role === 'customer').length;
  const activeClassesCount = classes.length;

  // 计算今天的排班数量
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const todaysSchedules = schedulesResponse?.data?.filter((sch: Schedule) => {
    const start = new Date(sch.startTime);
    return start >= today && start < tomorrow;
  }) || [];

  const stats = [
    { name: 'Total Users', value: customerCount.toString(), icon: UserGroupIcon },
    { name: 'Active Classes', value: activeClassesCount.toString(), icon: BookOpenIcon },
    { name: 'Today\'s Schedules', value: todaysSchedules.length.toString(), icon: CalendarIcon },
    { name: 'Pending Bookings', value: '0', icon: ClockIcon },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.username}. Here's an overview of your gym management system.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/users/new"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Add New User</h3>
                <p className="text-sm text-gray-500">Create a new user account</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/classes/new"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Create New Class</h3>
                <p className="text-sm text-gray-500">Add a new fitness class</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/schedules/new"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Schedule Class</h3>
                <p className="text-sm text-gray-500">Create a new class schedule</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 