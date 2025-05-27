export interface Class {
  id: string;
  name: string;
  description: string;
  duration: number; // 课程时长（分钟）
  capacity: number; // 课程容量
  instructor: string; // 教练名称
  level: 'beginner' | 'intermediate' | 'advanced'; // 课程难度级别
  category: string; // 课程类别
  imageUrl?: string; // 课程图片URL
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassFilters {
  level?: string;
  category?: string;
  instructor?: string;
}

export interface ClassDetail extends Class {
  longDescription?: string; // 详细描述
  requirements?: string[]; // 课程要求
  benefits?: string[]; // 课程好处
  equipment?: string[]; // 所需器材
  instructorBio?: string; // 教练简介
  instructorImage?: string; // 教练照片
}

export interface Schedule {
  _id: string;
  className: string;
  startTime: string;
  endTime: string;
  date: string;
  availableSpots: number;
  totalSpots: number;
  instructor: string;
  location: string;
  isBooked: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'yoga' | 'fitness' | 'dance';
}

export interface ScheduleFilters {
  date?: string;
  instructor?: string;
  level?: string;
  category?: string;
}

export interface Booking {
  _id: string;
  userId: string;
  scheduleId: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: string;
  updatedAt: string;
  schedule: {
    _id: string;
    className: string;
    date: string;
    startTime: string;
    endTime: string;
    instructor: string;
    location: string;
    level: string;
    category: string;
    totalSpots: number;
    availableSpots: number;
  };
} 