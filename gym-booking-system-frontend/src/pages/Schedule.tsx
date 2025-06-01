import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSchedules, createBooking } from '../services/api';
import type { ScheduleFilters } from '../types/class';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

const levelColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

export default function Schedule() {
  const [filters, setFilters] = useState<ScheduleFilters>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const { data: schedules, isLoading, error: fetchError } = useQuery({
    queryKey: ['schedules', filters],
    queryFn: () => getSchedules(filters)
  });

  const bookingMutation = useMutation({
    mutationFn: (scheduleId: string) => createBooking(scheduleId),
    onSuccess: () => {
      setShowConfirmModal(false);
      setSelectedSchedule(null);
      setError(null);
      // 刷新排课列表
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to create booking');
    }
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setFilters(prev => ({ ...prev, date }));
  };

  const handleFilterChange = (key: keyof ScheduleFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBookNow = (schedule: any) => {
    setSelectedSchedule(schedule);
    setShowConfirmModal(true);
    setError(null);
  };

  const handleConfirmBooking = () => {
    if (selectedSchedule) {
      console.log('Booking scheduleId:', selectedSchedule._id);
      bookingMutation.mutate(selectedSchedule._id);
    }
  };

  // 自动根据URL参数classId筛选
  useEffect(() => {
    const classId = searchParams.get('classId');
    if (classId) {
      setFilters((prev) => ({ ...prev, classId }));
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Failed to load schedule information. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">Class Schedule</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
            <input
              type="text"
              placeholder="Enter instructor name"
              value={filters.instructor || ''}
              onChange={(e) => handleFilterChange('instructor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={filters.level || ''}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="yoga">Yoga</option>
              <option value="fitness">Fitness</option>
              <option value="dance">Dance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules?.map((schedule) => (
          <div key={schedule._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{schedule.className}</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${levelColors[schedule.level]}`}>
                  {schedule.level}
                </span>
              </div>
              
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {format(new Date(schedule.date), 'MMMM dd, yyyy')}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {format(new Date(schedule.startTime), 'HH:mm')} - {format(new Date(schedule.endTime), 'HH:mm')}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Instructor: {typeof schedule.instructor === 'object' && schedule.instructor !== null
                    ? (schedule.instructor as { username?: string; name?: string }).username || (schedule.instructor as { username?: string; name?: string }).name || '未分配'
                    : schedule.instructor || '未分配'}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location: {schedule.location}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Available Spots: {schedule.availableSpots}/{schedule.totalSpots}
                </p>
              </div>

              <div className="mt-6">
                <button
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    schedule.availableSpots > 0
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={schedule.availableSpots === 0}
                  onClick={() => handleBookNow(schedule)}
                >
                  {schedule.availableSpots > 0 ? 'Book Now' : 'Full'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Booking</h3>
            <p className="mb-4">Are you sure you want to book this class?</p>
            <div className="space-y-2 mb-6">
              <p><span className="font-medium">Class:</span> {selectedSchedule.className}</p>
              <p><span className="font-medium">Date:</span> {format(new Date(selectedSchedule.date), 'MMMM dd, yyyy')}</p>
              <p><span className="font-medium">Time:</span> {format(new Date(selectedSchedule.startTime), 'HH:mm')} - {format(new Date(selectedSchedule.endTime), 'HH:mm')}</p>
              <p><span className="font-medium">Instructor:</span> {typeof selectedSchedule.instructor === 'object' && selectedSchedule.instructor !== null
                ? (selectedSchedule.instructor as { username?: string; name?: string }).username || (selectedSchedule.instructor as { username?: string; name?: string }).name || '未分配'
                : selectedSchedule.instructor || '未分配'}</p>
              <p><span className="font-medium">Location:</span> {selectedSchedule.location}</p>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedSchedule(null);
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleConfirmBooking}
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 