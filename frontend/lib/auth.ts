import Cookies from 'js-cookie';
import api from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  admin: {
    id: number;
    username: string;
    email: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  Cookies.remove('adminToken');
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
