import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';

interface Instructor {
  _id: string;
  username: string;
}

interface ClassFormData {
  name: string;
  description: string;
  instructor: string;
  duration: number;
  maxCapacity: number;
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
  });

  // Fetch instructors
  const { data: instructors } = useQuery<Instructor[]>({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await axios.get('/api/users/instructors');
      return response.data;
    },
  });

  // Fetch class data if in edit mode
  const { data: classData } = useQuery({
    queryKey: ['class', id],
    queryFn: async () => {
      const response = await axios.get(`/api/classes/${id}`);
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
      });
    }
  }, [classData]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: ClassFormData) => {
      if (isEditMode) {
        return axios.put(`/api/classes/${id}`, data);
      }
      return axios.post('/api/classes', data);
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
            {instructors?.map((instructor) => (
              <option key={instructor._id} value={instructor._id}>
                {instructor.username}
              </option>
            ))}
          </select>
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