export  interface ViewProduct {
  productId: number;
  productName: string;
  productDescription: string;
  productRate: number;
  productStatus: 'ACTIVE' | 'INACTIVE';
  rateChangeDate: string;
}

export interface ViewProductApiResponse {
  data: {
    items: ViewProduct[];
  };
  message: string;
}

export interface EditProductApiResponse {
  data: {
    item: ViewProduct;
  };
  message: string;
}
export interface EditProductPayload  {
  productId: number;
  productName: string;
  productDescription: string;
  productRate: number;

}

export interface AddProductPayload {
  productName: string;
  productDescription: string;
  productRate: number;
  productStatus: 'ACTIVE' | 'INACTIVE';
}

export interface MarkActiveInactivePayload {
  productId: number;
  productStatus: 'ACTIVE' | 'INACTIVE';
  productRate: number;
}