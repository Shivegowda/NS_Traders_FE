import apiClient from '../api/apiClient';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import type { BuyerDetails, ViewBuyerApiResponse } from '../types/buyer.types';

const fetchBuyers = (): Promise<BuyerDetails[]> => {
  return apiClient
    .get<ViewBuyerApiResponse>('/buyers/view')
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to fetch buyers data');
    });
};


export const useViewBuyers = () => {
  return useQuery<BuyerDetails[], Error>({
    queryKey: ['buyers'],
    queryFn: fetchBuyers,
  });
};


export const useAddBuyer =() => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BuyerDetails) => {
      return apiClient.post('/buyers/add', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyers'] });
    },
  });
};



export const useEditBuyer =() => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BuyerDetails) => {
      return apiClient.post('/buyers/update', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyers'] });
    },
  });
};


