import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8090/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const PUBLIC_ENDPOINTS = ['/login'];

// 1. Request Interceptor: Attach token if endpoint is private
axiosInstance.interceptors.request.use(
  (config) => {
    const isPublic = PUBLIC_ENDPOINTS.some(endpoint => config.url?.endsWith(endpoint));

    if (!isPublic && config.headers) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Catch wrong/expired tokens (401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server rejects the token with a 401 Unauthorized status
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      
      // Perform a hard-redirect to clear states and force login placement
      if (!window.location.pathname.endsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Pure Promise API Wrapper Engine
 */
const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get<T>(url, config)
      .then((response: AxiosResponse<T>) => response.data);
  },

  post: <T, R = unknown>(url: string, data?: R, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.post<T>(url, data, config)
      .then((response: AxiosResponse<T>) => response.data);
  },

  put: <T, R = unknown>(url: string, data?: R, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.put<T>(url, data, config)
      .then((response: AxiosResponse<T>) => response.data);
  },

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.delete<T>(url, config)
      .then((response: AxiosResponse<T>) => response.data);
  },
};

export default apiClient;
