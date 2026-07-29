import { AddressDTO } from '../auth/auth.interface';

/** Représente un adhérent tel que vu depuis l'espace d'administration (avec id, contrairement à CurrentUser) */
export interface AdminUser {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  role: string;
  addressDTO: AddressDTO;
}
