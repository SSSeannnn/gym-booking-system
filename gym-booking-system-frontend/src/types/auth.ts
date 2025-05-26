export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'customer' | 'admin' | 'instructor';
  planId: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
  };
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // 会员时长（月）
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface MembershipStatus {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
} 