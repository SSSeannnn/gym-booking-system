import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../services/api';
import { AxiosError } from 'axios';

export const useAuth = () => {
  const token = localStorage.getItem('token');
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: !!token,
    retry: false,
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor';
  const isCustomer = user?.role === 'customer';

  return {
    user,
    isLoading,
    error: error as AxiosError | null,
    isAuthenticated,
    isAdmin,
    isInstructor,
    isCustomer
  };
}; 