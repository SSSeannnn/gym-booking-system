import axios from 'axios';
import type { RegisterFormData, RegisterResponse, LoginFormData, LoginResponse, MembershipPlan, MembershipStatus } from '../types/auth';
import type { ClassFilters, ClassDetail, Schedule, ScheduleFilters } from '../types/class';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const register = async (data: RegisterFormData): Promise<RegisterResponse> => {
  try {
    // Remove confirmPassword from the request data
    const { confirmPassword, ...registerData } = data;
    console.log('Registering with data:', registerData);
    const response = await api.post<RegisterResponse>('/auth/register', registerData);
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error);
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  try {
    console.log('Logging in with data:', data);
    const response = await api.post<LoginResponse>('/auth/login', data);
    console.log('Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error);
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
  try {
    const response = await api.get<{ data: MembershipPlan[] }>('/memberships/plans');
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch membership plans' };
  }
};

export interface UserProfile {
  id: string;
  email: string;
  role: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<{ data: UserProfile }>('/auth/profile');
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// 课程相关API
export const getClasses = async (filters?: ClassFilters) => {
  const params = new URLSearchParams();
  if (filters?.level) params.append('level', filters.level);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.instructor) params.append('instructor', filters.instructor);
  
  const response = await api.get(`/classes?${params.toString()}`);
  return response.data;
};

export const getClassDetail = async (classId: string): Promise<ClassDetail> => {
  const response = await api.get(`/classes/${classId}`);
  return response.data;
};

export const getClassSchedules = async (classId: string): Promise<Schedule[]> => {
  const response = await api.get(`/classes/${classId}/schedules`);
  return response.data;
};

// 排班相关API
export const getSchedules = async (filters?: ScheduleFilters): Promise<Schedule[]> => {
  const params = new URLSearchParams();
  if (filters?.date) params.append('date', filters.date);
  if (filters?.instructor) params.append('instructor', filters.instructor);
  if (filters?.level) params.append('level', filters.level);
  if (filters?.category) params.append('category', filters.category);
  
  const response = await api.get(`/schedules?${params.toString()}`);
  return response.data;
};

// 会员相关API
export const getMembershipStatus = async (): Promise<MembershipStatus> => {
  try {
    const response = await api.get<{ data: MembershipStatus }>('/memberships/me/membership');
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch membership status' };
  }
};

export const cancelMembership = async (): Promise<void> => {
  try {
    await api.post('/memberships/me/cancel');
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to cancel membership' };
  }
};

export const renewMembership = async (planId: string): Promise<void> => {
  try {
    await api.post('/memberships/me/renew', { planId });
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to renew membership' };
  }
}; 