import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyBookings, cancelBooking } from '../services/api';
import { format } from 'date-fns';
import type { Booking } from '../types/class';

export default function MyBookings() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, error: fetchError } = useQuery({
    queryKey: ['myBookings'],
    queryFn: getMyBookings
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => {
      setShowCancelModal(false);
      setSelectedBooking(null);
      setError(null);
      // 刷新预订列表
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to cancel booking');
    }
  });

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
    setError(null);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking) {
      cancelMutation.mutate(selectedBooking._id);
    }
  };

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
        <div className="text-red-500">Failed to load bookings. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings?.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{booking.schedule.className}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(booking.schedule.date), 'MMMM dd, yyyy')}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {format(new Date(booking.schedule.startTime), 'HH:mm')} - {format(new Date(booking.schedule.endTime), 'HH:mm')}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Instructor: {booking.schedule.instructor}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location: {booking.schedule.location}
                  </p>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="mt-6">
                    <button
                      className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Cancel Booking</h3>
            <p className="mb-4">Are you sure you want to cancel this booking?</p>
            <div className="space-y-2 mb-6">
              <p><span className="font-medium">Class:</span> {selectedBooking.schedule.className}</p>
              <p><span className="font-medium">Date:</span> {format(new Date(selectedBooking.schedule.date), 'MMMM dd, yyyy')}</p>
              <p><span className="font-medium">Time:</span> {format(new Date(selectedBooking.schedule.startTime), 'HH:mm')} - {format(new Date(selectedBooking.schedule.endTime), 'HH:mm')}</p>
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
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                  setError(null);
                }}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                onClick={handleConfirmCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 