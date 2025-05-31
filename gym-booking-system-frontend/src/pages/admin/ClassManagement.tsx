import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Class {
  id: string;
  name: string;
  description: string;
  instructor: {
    _id: string;
    username: string;
  };
  duration: number;
  maxCapacity: number;
  level: string;
  category: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

const ClassManagement = () => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch classes
  const { data: classesResponse, isLoading, error } = useQuery<ApiResponse<Class[]>>({
    queryKey: ['classes'],
    queryFn: async () => {
      try {
        console.log('Fetching classes...');
        const response = await axios.get('/classes');
        console.log('Classes response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
      }
    },
  });

  const classes = classesResponse?.data || [];

  // 添加调试日志
  console.log('Classes data:', classes);
  console.log('Classes IDs:', classes.map(c => c.id));

  // Delete class mutation
  const deleteMutation = useMutation({
    mutationFn: async (classId: string) => {
      if (!classId) {
        throw new Error('Class ID is required');
      }
      try {
        console.log('Deleting class with ID:', classId);
        const response = await axios.delete(`/classes/${classId}`);
        console.log('Delete response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error deleting class:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsDeleting(false);
    },
  });

  const handleDelete = async (classId: string) => {
    if (!classId) {
      console.error('No class ID provided for deletion');
      return;
    }
    if (window.confirm('Are you sure you want to delete this class?')) {
      setIsDeleting(true);
      deleteMutation.mutate(classId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <Link
            to="/admin/classes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create New Class
          </Link>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <Link
            to="/admin/classes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create New Class
          </Link>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            Failed to load classes: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
        <Link
          to="/admin/classes/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create New Class
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {classes && classes.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {classes.map((classItem) => (
              <li key={classItem.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {classItem.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {classItem.description}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="mr-4">
                          Instructor: {classItem.instructor?.username || 'Unassigned'}
                        </span>
                        <span className="mr-4">
                          Max Capacity: {classItem.maxCapacity}
                        </span>
                        <span className="mr-4">
                          Level: {classItem.level}
                        </span>
                        <span>
                          Category: {classItem.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/classes/${classItem.id}/edit`}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      </Link>
                      <button
                        onClick={() => {
                          console.log('Delete button clicked for class:', classItem.id);
                          handleDelete(classItem.id);
                        }}
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
            <p className="text-gray-500">No classes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement; 