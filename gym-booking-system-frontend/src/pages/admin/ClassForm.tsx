import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';

interface Instructor {
  _id: string;
  username: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface ClassFormData {
  name: string;
  description: string;
  instructor: string;
  duration: number;
  maxCapacity: number;
  level: string;
  category: string;
}

const ClassForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    description: '',
    instructor: '',
    duration: 60,
    maxCapacity: 20,
    level: 'beginner',
    category: ''
  });

  // Fetch instructors
  const { data: instructorsResponse } = useQuery<ApiResponse<Instructor[]>>({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await axios.get('/users/instructors');
      console.log('Instructors API response:', response.data);
      return response.data;
    },
  });

  const instructors = instructorsResponse?.data || [];
  console.log('Processed instructors data:', instructors);

  // Fetch class data if in edit mode
  const { data: classData } = useQuery({
    queryKey: ['class', id],
    queryFn: async () => {
      const response = await axios.get(`/classes/${id}`);
      return response.data;
    },
    enabled: isEditMode,
  });

  // Update form data when class data is loaded
  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        description: classData.description,
        instructor: classData.instructor._id,
        duration: classData.duration,
        maxCapacity: classData.maxCapacity,
        level: classData.level,
        category: classData.category,
      });
    }
  }, [classData]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: ClassFormData) => {
      if (isEditMode) {
        return axios.put(`/classes/${id}`, data);
      }
      return axios.post('/classes', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      navigate('/admin/classes');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'maxCapacity' ? Number(value) : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Class' : 'Create New Class'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Class Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            required
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
            Instructor
          </label>
          <select
            name="instructor"
            id="instructor"
            required
            value={formData.instructor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Instructor</option>
            {Array.isArray(instructors) && instructors.map((instructor) => (
              <option key={instructor._id} value={instructor._id}>
                {instructor.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <select
            name="level"
            id="level"
            required
            value={formData.level}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            min="15"
            step="15"
            required
            value={formData.duration}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">
            Max Capacity
          </label>
          <input
            type="number"
            name="maxCapacity"
            id="maxCapacity"
            min="1"
            required
            value={formData.maxCapacity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/classes')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Class'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm; 