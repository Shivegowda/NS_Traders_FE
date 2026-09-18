export  interface ViewFarmer {
  farmerId: number;
  farmerName: string;
  mobileNumber: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdDate: string;
}

export interface ViewFarmerApiResponse {
  data: {
    items: ViewFarmer[];
  };
  message: string;
}


export interface EditFarmerRequest {
  farmerId: number;
  farmerName: string;
  mobileNumber: string;
  address: string;
}

export interface EditFarmerApiResponse {
  data: {
    item: ViewFarmer;
  };
  message: string;
}

export interface AddFarmerPayload {
  farmerName: string;
  mobileNumber: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
}
