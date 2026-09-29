export interface BuyerDetails {
    BuyerId: number;
    BuyerName: string;
    mobileNumber: string;
    address: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdDate: string;
}

export interface ViewBuyerApiResponse {
  data: {
    items: BuyerDetails[] ;
  };
  message: string;
}

export interface AddBuyerApiResponse {
  data: {
    item: BuyerDetails;
  };
  message: string;
}