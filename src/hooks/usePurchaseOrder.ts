import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type { PurchaseOrder, ViewOrdersApiResponse } from '../types/purchaseOrder.types';
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