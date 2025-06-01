import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClasses } from '../services/api';
import type { Class, ClassFilters } from '../types/class';
import { useNavigate } from 'react-router-dom';

const levelColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

const Classes = () => {
  const [filters, setFilters] = useState<ClassFilters>({});
  const navigate = useNavigate();

  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['classes', filters],
    queryFn: () => getClasses(filters),
  });

  const handleFilterChange = (key: keyof ClassFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error loading classes</h2>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 过滤器 */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white"
          onChange={(e) => handleFilterChange('level', e.target.value)}
          value={filters.level || ''}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white"
          onChange={(e) => handleFilterChange('category', e.target.value)}
          value={filters.category || ''}
        >
          <option value="">All Categories</option>
          <option value="yoga">Yoga</option>
          <option value="pilates">Pilates</option>
          <option value="strength">Strength Training</option>
          <option value="cardio">Cardio</option>
        </select>

        <input
          type="text"
          placeholder="Search by instructor..."
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white"
          onChange={(e) => handleFilterChange('instructor', e.target.value)}
          value={filters.instructor || ''}
        />
      </div>

      {/* 课程列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes?.map((classItem: Class) => (
          <div
            key={classItem.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {classItem.imageUrl && (
              <img
                src={classItem.imageUrl}
                alt={classItem.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-900">{classItem.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[classItem.level]}`}>
                  {classItem.level}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{classItem.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {classItem.duration} minutes
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Capacity: {classItem.capacity} people
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Instructor: {typeof classItem.instructor === 'object' && classItem.instructor !== null
                    ? (classItem.instructor as { username?: string }).username || 'unassigned'
                    : classItem.instructor || 'Unassigned'}
                </div>
              </div>
              <div className="mt-6">
                <button
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                  onClick={() => navigate(`/schedule?classId=${classItem.id}`)}
                >
                  View Schedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes; 