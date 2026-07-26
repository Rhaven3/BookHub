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
  email: string;
  role: string;
  expiresAt: number;
}

export interface CurrentUser {
  email: string;
  role: string;
}
