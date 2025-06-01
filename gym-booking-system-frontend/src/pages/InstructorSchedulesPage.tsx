import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getClasses, getSchedules } from '../services/api';
import type { Schedule, Class } from '../types/class';

export default function InstructorSchedulesPage() {
  const { user } = useAuth();

  // 先查所有class
  const { data: classes, isLoading: isLoadingClasses, error: errorClasses } = useQuery<Class[]>({
    queryKey: ['instructorClasses', user?.id],
    queryFn: () => getClasses({ instructor: user?.id }),
    enabled: !!user?.id,
  });

  // 再查所有schedule（classId为instructor所有class的id）
  const classIds = classes?.map(c => c.id) || [];
  const { data: schedules, isLoading: isLoadingSchedules, error: errorSchedules } = useQuery<Schedule[]>({
    queryKey: ['instructorSchedules', classIds],
    queryFn: async () => {
      if (classIds.length === 0) return [];
      // 多个classId，分别查再合并
      const all: Schedule[] = [];
      for (const classId of classIds) {
        const res = await getSchedules({ classId });
        if (Array.isArray(res)) all.push(...res);
      }
      return all;
    },
    enabled: classIds.length > 0,
  });

  if (isLoadingClasses || isLoadingSchedules) return <div>Loading...</div>;
  if (errorClasses || errorSchedules) return <div>Failed to load schedules.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Schedules</h1>
      {schedules && schedules.length > 0 ? (
        <ul>
          {schedules.map((schedule) => (
            <li key={schedule._id || schedule.id} className="mb-4 p-4 border rounded">
              <div>Class Name: {schedule.className}</div>
              <div>Time: {schedule.startTime} - {schedule.endTime}</div>
              <div>Room: {schedule.room}</div>
              <div>Available Spots: {schedule.availableSpots}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No schedules found.</div>
      )}
    </div>
  );
} 