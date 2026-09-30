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
    