import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import type { InventoryItem, ViewInventoryApiResponse } from "../types/inventory.types";



// 1. Core API Request function using Promise chaining
const fetchInventory = (): Promise<InventoryItem[]> => {
  console.log("Fetching inventory data...");
  return apiClient
    .get<ViewInventoryApiResponse>('/inventory/view')
    .then((response) => {
      if (response.message === "SUCCESS") {
        console.log("Inventory data fetched successfully:", response.data.items);
        return response.data.items;
      }
      throw new Error(response.message || 'Failed to fetch inventory data');
    });
};

// 2. Custom Hook to expose inside the component
export const useInventory = () => {
  return useQuery<InventoryItem[], Error>({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });
};