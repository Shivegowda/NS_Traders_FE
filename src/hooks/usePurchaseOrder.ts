import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type { EditPurchaseOrderApiResponse, EditPurchaseOrderRequest, PurchaseOrder, ViewOrdersApiResponse } from '../types/purchaseOrder.types';
import type {AxiosRequestConfig} from 'axios';

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
