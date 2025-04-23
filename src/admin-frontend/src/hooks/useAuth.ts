import { useState, useEffect } from 'react';
import axios from 'axios';

// Базовый URL для API запросов - всегда относительный путь,
// который будет обрабатываться nginx
const API_BASE_URL = '/api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false,
    error: null,
  });

  const checkAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      
      if (response.status === 200 && response.data.authenticated) {
        setAuthState({
          user: {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
          },
          loading: false,
          authenticated: true,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          authenticated: false,
          error: null,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        authenticated: false,
        error: 'Failed to verify authentication',
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      
      if (response.status === 200) {
        await checkAuth(); // Проверяем статус аутентификации после успешного входа
        return true;
      }
      return false;
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        authenticated: false,
        error: error.response?.data?.message || 'Login failed',
      }));
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      
      if (response.status === 200) {
        await checkAuth(); // Проверяем статус аутентификации после успешной регистрации
        return true;
      }
      return false;
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        authenticated: false,
        error: error.response?.data?.message || 'Registration failed',
      }));
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
      setAuthState({
        user: null,
        loading: false,
        authenticated: false,
        error: null,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  // Проверяем статус аутентификации при загрузке компонента
  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    checkAuth,
  };
}; 