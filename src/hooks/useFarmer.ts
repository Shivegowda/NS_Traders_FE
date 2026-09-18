import type {ViewFarmerApiResponse,ViewFarmer, EditFarmerRequest, EditFarmerApiResponse, AddFarmerPayload} from '../types/farmer.types';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';


// 1. Core API Request function using Promise chaining
const fetchFarmers = (): Promise<ViewFarmer[]> => {
  return apiClient
    .get<ViewFarmerApiResponse>('/farmers/view')
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to fetch farmers data');
    });
};

// 2. Custom Hook to expose inside the component
export const useFarmers = () => {
  return useQuery<ViewFarmer[], Error>({
    queryKey: ['farmers'],
    queryFn: fetchFarmers,
  });
};



const editFarmers = (payload: EditFarmerRequest): Promise<ViewFarmer> => {
  return apiClient
    .put<EditFarmerApiResponse>('/farmers/edit', payload)
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.item;
      }
      throw new Error(response.message || 'Failed to edit farmers data');
    });
};

export const useEditFarmers = () => {
  const queryClient = useQueryClient();

  return useMutation<ViewFarmer, Error, EditFarmerRequest>({
    mutationFn: editFarmers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmers'] });
    },
  });
};


export const useAddFarmer =() => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddFarmerPayload) => {
      return apiClient.post('/farmers/add', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmers'] });
    },
  });
};
