


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
