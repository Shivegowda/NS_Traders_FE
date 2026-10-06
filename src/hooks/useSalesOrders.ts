import type { AxiosRequestConfig } from "axios";
import type { EditSalesOrderRequest, NewOrderPayload, SalesOrder, SalesOrderApiResponse, ViewOrdersApiResponse } from "../types/salesOrders.types";
import apiClient from "../api/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FarmerDropDown, FarmerListResponse } from "../types/purchaseOrder.types";



const fetchSalesOrders = (orderType: string): Promise<SalesOrder[]> => {
    const config: AxiosRequestConfig = {
        params: {
            orderType: orderType,
        },
    }
  return apiClient
    .get<ViewOrdersApiResponse>('/order/sale/view', config)
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to fetch purchase orders');
    });
};

// 2. Custom Hook to expose inside the component
export const useSalesOrders = (orderType: string) => {
  return useQuery<SalesOrder[], Error>({
    queryKey: ['orders',orderType],
    queryFn:() => fetchSalesOrders(orderType),
  });
};

const addDraftOrder = (payload: NewOrderPayload): Promise<SalesOrder> => {
  return apiClient
    .post<SalesOrderApiResponse>('/order/sale/add', payload)
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.item;
      }
      throw new Error(response.message || 'Failed to add draft order');
    });
};

export const useAddDraftOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<SalesOrder, Error, NewOrderPayload>({
    mutationFn: addDraftOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};


const getBuyerList = () : Promise<FarmerDropDown[]> => {
  return apiClient
    .get<FarmerListResponse>('/buyers/list')
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to fetch Buyers list');
    });
};

export const useBuyerListDropDown = (enabled: boolean) => {  
  return useQuery<FarmerDropDown[], Error>({
    queryKey: ['buyerList'],
    queryFn:() => getBuyerList(),
    enabled: enabled,
  });
};


const editSalesOrder = (payload: EditSalesOrderRequest): Promise<SalesOrder> => {
  return apiClient
    .put<SalesOrderApiResponse>('/order/sale/update', payload)
    .then((response) => {
      if (response.message === "SUCCESS") {
        return response.data.item;
      }
      throw new Error(response.message || 'Failed to edit Sales Order data');
    });
};

export const useEditSalesOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<SalesOrder, Error, EditSalesOrderRequest>({
    mutationFn: editSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};


 const deletePurchaseOrder = (orderId: number): Promise<ViewOrdersApiResponse> => { 
      const config: AxiosRequestConfig = {
        params: {
            orderId: orderId,
        },
    }
    return apiClient.delete<ViewOrdersApiResponse>('/order/sale/delete', config)
      .then((response) => {
        if (response.message === "SUCCESS") {
          return response;
        }
        throw new Error('Failed to delete sales order');
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




    const submitDraftOrder = (order: SalesOrder): Promise<ViewOrdersApiResponse> => { 
    
    return apiClient.post<ViewOrdersApiResponse>('/order/sale/submit', order)
      .then((response) => {
        if (response.message === "SUCCESS") {
          return response;
        }
        throw new Error('Failed to submit draft order');
      });
  };

 export const useSubmitDraftOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<ViewOrdersApiResponse, Error, SalesOrder>({
    mutationFn: submitDraftOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
  };


