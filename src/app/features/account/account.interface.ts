import { AddressRequest } from '../auth/auth.interface';

export interface UpdateProfileRequest {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  address: AddressRequest;
}


