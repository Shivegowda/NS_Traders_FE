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
