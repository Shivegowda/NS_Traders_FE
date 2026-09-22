import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type {MarkActiveInactivePayload, AddProductPayload, EditProductApiResponse, EditProductPayload, ViewProduct, ViewProductApiResponse } from '../types/product.types';


const fetchProducts = (): Promise<ViewProduct[]> => {
  return apiClient
    .get<ViewProductApiResponse>('/product/view')
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to fetch products data');
    });
};


export const useProducts = () => {
  return useQuery<ViewProduct[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

const editProduct = (payload: EditProductPayload): Promise<ViewProduct> => {
  return apiClient
    .put<EditProductApiResponse>('/product/edit', payload)
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.item;
      }
      throw new Error(response.message || 'Failed to edit products data');
    });
};

export const useEditProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ViewProduct, Error, EditProductPayload>({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};


export const useAddProduct =() => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddProductPayload) => {
      return apiClient.post('/product/add', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

const markActiveInactiveProduct = (payload: MarkActiveInactivePayload): Promise<ViewProduct> => {
  return apiClient
    .put<EditProductApiResponse>('/product/active', payload)
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.item;
      }
      throw new Error(response.message || 'Failed to mark product as active/inactive');
    });
};

export const useMarkActiveInactiveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ViewProduct, Error, MarkActiveInactivePayload>({
    mutationFn: markActiveInactiveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};


