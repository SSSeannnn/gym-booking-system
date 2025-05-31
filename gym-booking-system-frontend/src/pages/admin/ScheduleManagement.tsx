import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Class {
  _id: string;
  name: string;
}

interface Schedule {
  _id: string;
  classId: {
    _id: string;
    name: string;
  };
  instructor: {
    _id: string;
    username: string;
  };
  startTime: string;
  endTime: string;
  totalSpots: number;
  availableSpots: number;
  location: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

const ScheduleManagement = () => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState({
    date: '',
    classId: '',
  });

  // Fetch schedules
  const { data: schedulesResponse, isLoading, error } = useQuery<ApiResponse<Schedule[]>>({
    queryKey: ['schedules', filters],
    queryFn: async () => {
      console.log('Fetching schedules with filters:', filters);
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.classId) params.append('classId', filters.classId);
      const response = await axios.get(`/schedules?${params.toString()}`);
      console.log('Schedules response:', response.data);
      return response.data;
    },
  });

  // Fetch classes for filter
  const { data: classesResponse } = useQuery<ApiResponse<Class[]>>({
    queryKey: ['classes'],
    queryFn: async () => {
      console.log('Fetching classes');
      const response = await axios.get('/classes');
      console.log('Classes response:', response.data);
      return response.data;
    },
  });

  const schedules = schedulesResponse?.data || [];
  const classes = classesResponse?.data || [];

  // Delete schedule mutation
  const deleteMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      await axios.delete(`/schedules/${scheduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsDeleting(false);
    },
  });

  const handleDelete = async (scheduleId: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setIsDeleting(true);
      deleteMutation.mutate(scheduleId);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <Link
            to="/admin/schedules/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create New Schedule
          </Link>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading schedules...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <Link
            to="/admin/schedules/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create New Schedule
          </Link>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            Error loading schedules: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
        <Link
          to="/admin/schedules/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create New Schedule
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
            Class
          </label>
          <select
            name="classId"
            id="classId"
            value={filters.classId}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option key="all" value="">All Classes</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {schedules.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <li key={schedule._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {schedule.classId.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <div key="instructor">
                          <span className="font-medium">Instructor:</span>{' '}
                          {schedule.instructor.username}
                        </div>
                        <div key="time">
                          <span className="font-medium">Time:</span>{' '}
                          {new Date(schedule.startTime).toLocaleString()} -{' '}
                          {new Date(schedule.endTime).toLocaleString()}
                        </div>
                        <div key="room">
                          <span className="font-medium">Room:</span> {schedule.location}
                        </div>
                        <div key="bookings">
                          <span className="font-medium">Bookings:</span>{' '}
                          {schedule.totalSpots - schedule.availableSpots}/{schedule.totalSpots}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/schedules/${schedule._id}/edit`}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      </Link>
                      <button
                        onClick={() => handleDelete(schedule._id)}
                        disabled={isDeleting}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No schedules found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement; 