
export interface InventoryItem {
    
    productId: number;
    productName: string;
    purchasedQuantity: number;
    soldQuantity: number;
    netQuantity: number;
}

export interface ViewInventoryApiResponse {
  data: {
    items: InventoryItem[];
  };
  message: string;
}