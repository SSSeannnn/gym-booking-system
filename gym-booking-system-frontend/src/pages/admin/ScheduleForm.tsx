import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';

interface Class {
  _id: string;
  name: string;
  instructor: {
    _id: string;
    username: string;
  };
  duration: number;
}

interface ScheduleFormData {
  classId: string;
  startTime: string;
  endTime: string;
  totalSpots: number;
  location: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

const ScheduleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<ScheduleFormData>({
    classId: '',
    startTime: '',
    endTime: '',
    totalSpots: 20,
    location: '',
  });

  // Fetch classes
  const { data: classesResponse } = useQuery<ApiResponse<Class[]>>({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await axios.get('/api/classes');
      return response.data;
    },
  });

  const classes = classesResponse?.data || [];

  // Fetch schedule data if in edit mode
  const { data: scheduleResponse } = useQuery<ApiResponse<any>>({
    queryKey: ['schedule', id],
    queryFn: async () => {
      const response = await axios.get(`/api/schedules/${id}`);
      return response.data;
    },
    enabled: isEditMode,
  });

  // Update form data when schedule data is loaded
  useEffect(() => {
    if (scheduleResponse?.data) {
      const scheduleData = scheduleResponse.data;
      setFormData({
        classId: scheduleData.classId._id,
        startTime: new Date(scheduleData.startTime).toISOString().slice(0, 16),
        endTime: new Date(scheduleData.endTime).toISOString().slice(0, 16),
        totalSpots: scheduleData.totalSpots,
        location: scheduleData.location,
      });
    }
  }, [scheduleResponse]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: ScheduleFormData) => {
      if (isEditMode) {
        return axios.put(`/api/schedules/${id}`, data);
      }
      return axios.post('/api/schedules', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      navigate('/admin/schedules');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalSpots' ? Number(value) : value,
    }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    const selectedClass = classes.find((c) => c._id === classId);
    
    if (selectedClass && formData.startTime) {
      const startTime = new Date(formData.startTime);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + selectedClass.duration);
      
      setFormData((prev) => ({
        ...prev,
        classId,
        endTime: endTime.toISOString().slice(0, 16),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        class: classId,
      }));
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startTime = e.target.value;
    const selectedClass = classes.find((c) => c._id === formData.class);
    
    if (selectedClass) {
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + selectedClass.duration);
      
      setFormData((prev) => ({
        ...prev,
        startTime,
        endTime: endTime.toISOString().slice(0, 16),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        startTime,
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Schedule' : 'Create New Schedule'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="class" className="block text-sm font-medium text-gray-700">
            Class
          </label>
          <select
            name="class"
            id="class"
            required
            value={formData.class}
            onChange={handleClassChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.name} {classItem.instructor?.username ? `(Instructor: ${classItem.instructor.username})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="datetime-local"
            name="startTime"
            id="startTime"
            required
            value={formData.startTime}
            onChange={handleStartTimeChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="datetime-local"
            name="endTime"
            id="endTime"
            required
            value={formData.endTime}
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

        <div>
          <label htmlFor="room" className="block text-sm font-medium text-gray-700">
            Room
          </label>
          <input
            type="text"
            name="room"
            id="room"
            required
            value={formData.room}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/schedules')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm; 