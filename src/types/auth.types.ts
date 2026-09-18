export interface LoginRequest {
  userName: string;
  password?: string;
}

export interface UserItem {
  jwtToken: string;
  userName: string;
}

export interface LoginResponseData {
  item: UserItem;
}

export interface LoginResponse {
  data: LoginResponseData;
  message: string;
}
