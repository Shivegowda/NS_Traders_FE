import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

const loginUser = (payload: LoginRequest): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse, LoginRequest>('/login', payload);
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (response) => {
      const token = response?.data?.item?.jwtToken;
      if (token) {
        localStorage.setItem('authToken', token);
      }
    },
  });
};
