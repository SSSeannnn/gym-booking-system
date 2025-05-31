import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClassDetail, getClassSchedules } from '../services/api';
import type { Schedule } from '../types/class';

const levelColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: classDetail, isLoading: isLoadingClass } = useQuery({
    queryKey: ['class', id],
    queryFn: () => getClassDetail(id!),
    enabled: !!id,
  });

  const { data: schedules, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ['classSchedules', id],
    queryFn: () => getClassSchedules(id!),
    enabled: !!id,
  });

  if (isLoadingClass || isLoadingSchedules) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Class not found</h2>
        <button
          onClick={() => navigate('/classes')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Back to Classes
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/classes')}
        className="mb-6 text-primary-600 hover:text-primary-700 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Classes
      </button>

      {/* 课程详情 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {classDetail.imageUrl && (
          <div className="relative h-64 md:h-96">
            <img
              src={classDetail.imageUrl}
              alt={classDetail.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{classDetail.name}</h1>
              <div className="flex items-center mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[classDetail.level as keyof typeof levelColors]}`}>
                  {classDetail.level}
                </span>
                <span className="ml-4 text-sm">
                  {classDetail.duration} minutes
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">About This Class</h2>
              <p className="text-gray-600 mb-6">{classDetail.longDescription || classDetail.description}</p>

              {classDetail.requirements && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Requirements</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {classDetail.requirements.map((req: string, index: number) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {classDetail.benefits && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Benefits</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {classDetail.benefits.map((benefit: string, index: number) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {classDetail.equipment && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Equipment Needed</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {classDetail.equipment.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 教练信息 */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Instructor</h2>
              <div className="flex items-start space-x-4">
                {classDetail.instructorImage && (
                  <img
                    src={classDetail.instructorImage}
                    alt={classDetail.instructor}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-medium">{classDetail.instructor}</h3>
                  {classDetail.instructorBio && (
                    <p className="text-gray-600 mt-2">{classDetail.instructorBio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 排班信息 */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Available Schedules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules?.map((schedule: Schedule) => (
                <div
                  key={schedule._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium">{formatDate(schedule.date)}</p>
                      <p className="text-gray-600">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {schedule.availableSpots} spots left
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>Location: {schedule.location}</p>
                    <p>Instructor: {schedule.instructor}</p>
                  </div>
                  <button
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={schedule.availableSpots === 0 || schedule.isBooked}
                    onClick={() => {/* TODO: 实现预约功能 */}}
                  >
                    {schedule.isBooked ? 'Booked' : schedule.availableSpots === 0 ? 'Full' : 'Book Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail; 