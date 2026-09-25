export interface PurchaseOrder {
                "amount": number;
                "createdDate": string;
                "orderId": 4;
                "orderType": 'ORDER'| 'DRAFT';
                "orderedBy": number;
                "orderedByName": string;
                "productId": number;
                "productName":string;
                "quantity":number;
                "rate":number;
}

export interface ViewOrdersApiResponse {
  data: {
    items: PurchaseOrder[];
  };
  message: string;
}

export interface EditPurchaseOrderRequest {
  orderId: number;
  quantity: number;
  rate: number;
  amount: number;
}

export interface EditPurchaseOrderApiResponse {
    data: {
    item: PurchaseOrder;
  };
  message: string;
}


export interface NewOrderPayload {
                "amount": number;
                "orderedBy": number;
                "orderedByName": string;
                "productId": number;
                "productName":string;
                "quantity":number;
                "rate":number;
}


export interface Product {
  "productId": number;
  "productName": string;
  "productRate": number;
}

export interface ProductListResponse {
  data: {
    items: Product[];
  };
  message: string;
}

export interface FarmerDropDown {
  "value":string,
  "label":string
}

export interface FarmerListResponse {
  data: {
    items: FarmerDropDown[];
  };
  message: string;
}