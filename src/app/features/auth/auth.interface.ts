export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  lastName: string;
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
  lastName: string;
  role: string;
  firstName: string;
  email: string;
  phone: string;
  addressDTO: AddressDTO;
}

export interface AddressDTO {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
