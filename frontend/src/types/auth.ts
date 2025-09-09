// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    phone?: string;
    location?: string;
    avatar?: string;
    force_password_change: boolean;
    email_verified_at?: string;
  };
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  location?: string;
  role?: 'customer' | 'store_owner';
  store_name?: string;
  store_domain?: string;
  store_description?: string;
  store_currency?: string;
  store_language?: string;
  store_timezone?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    phone?: string;
    location?: string;
    force_password_change: boolean;
    email_verified_at?: string;
  };
  store?: {
    id: number;
    name: string;
    domain: string;
    status: string;
  };
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  location?: string;
  avatar?: string;
  force_password_change: boolean;
  email_verified_at?: string;
}












