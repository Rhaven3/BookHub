export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  firstName: string;
  email: string;
  password: string;
  phone: string;
  address: AddressRequest;
}

export interface AddressRequest {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AuthResponse {
  accessToken: string;
  user: CurrentUser;
  expiresAt: number;
}

export interface CurrentUser {
  id : number;
  name: string;
  role: string;
  firstName: string;
  email: string;
  phone: string;
  gender: string;
  addressDTO: AddressDTO;
}

export interface AddressDTO {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
