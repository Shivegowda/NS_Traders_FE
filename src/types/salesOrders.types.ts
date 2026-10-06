export interface SalesOrder {
    orderId: number;
    productId: number;
    productName: string;
    rate: number;
    quantity: number;
    amount: number;
    orderType: 'DRAFT' | 'ORDER';
    orderedBy: number;
    orderedByName: string;
    createdDate: string;   
}  

export interface ViewOrdersApiResponse {
  data: {
    items: SalesOrder[];
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

export interface SalesOrderApiResponse {
    data: {
    item: SalesOrder;
  };
  message: string;
}


export interface EditSalesOrderRequest {
  orderId: number;
  quantity: number;
  rate: number;
  amount: number;
}