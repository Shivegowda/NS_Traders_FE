import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type { EditPurchaseOrderApiResponse, EditPurchaseOrderRequest, FarmerDropDown, FarmerListResponse, NewOrderPayload, Product, ProductListResponse, PurchaseOrder, ViewOrdersApiResponse } from '../types/purchaseOrder.types';
import type {AxiosRequestConfig} from 'axios';
import { useState } from 'react';

const fetchPurchaseOrders = (orderType: string): Promise<PurchaseOrder[]> => {
    const config: AxiosRequestConfig = {
        params: {
            orderType: orderType,
        },
    }
  return apiClient
    .get<ViewOrdersApiResponse>('/order/purchase/view', config)
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to fetch purchase orders');
    });
};

// 2. Custom Hook to expose inside the component
export const usePurchaseOrders = (orderType: string) => {
  return useQuery<PurchaseOrder[], Error>({
    queryKey: ['orders',orderType],
    queryFn:() => fetchPurchaseOrders(orderType),
  });
};



const editPurchaseOrder = (payload: EditPurchaseOrderRequest): Promise<PurchaseOrder> => {
  return apiClient
    .put<EditPurchaseOrderApiResponse>('/order/purchase/update', payload)
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.item;
      }
      throw new Error(response.message || 'Failed to edit farmers data');
    });
};

export const useEditPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrder, Error, EditPurchaseOrderRequest>({
    mutationFn: editPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

const addDraftOrder = (payload: NewOrderPayload): Promise<PurchaseOrder> => {
  return apiClient
    .post<EditPurchaseOrderApiResponse>('/order/purchase/add', payload)
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.item;
      }
      throw new Error(response.message || 'Failed to add draft order');
    });
};

export const useAddDraftOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrder, Error, NewOrderPayload>({
    mutationFn: addDraftOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

const getProductList = (): Promise<Product[]> => {
  return apiClient
    .get<ProductListResponse>('/product/list')
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to fetch product list');
    });
};


export const useProductListDropDown = (enabled: boolean) => {  
  return useQuery<Product[], Error>({
    queryKey: ['productList'],
    queryFn:() => getProductList(),
    enabled: enabled,
  });
};

const getFarmerList = () : Promise<FarmerDropDown[]> => {
  return apiClient
    .get<FarmerListResponse>('/farmers/dropDownList')
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to fetch farmer list');
    });
};

export const useFarmerListDropDown = (enabled: boolean) => {  
  return useQuery<FarmerDropDown[], Error>({
    queryKey: ['farmerList'],
    queryFn:() => getFarmerList(),
    enabled: enabled,
  });
};


  const deletePurchaseOrder = (orderId: number): Promise<ViewOrdersApiResponse> => { 
      const config: AxiosRequestConfig = {
        params: {
            orderId: orderId,
        },
    }
    return apiClient.delete<ViewOrdersApiResponse>('/order/purchase/delete', config)
      .then((response) => {
        if (response.message === "SUCCESS") {
          return response;
        }
        throw new Error('Failed to delete purchase order');
      });
  };

 export const useDeleteDraftOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<ViewOrdersApiResponse, Error, number>({
    mutationFn: deletePurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
  };


