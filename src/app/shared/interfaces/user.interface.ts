import { RoleCode } from '@shared/enums';

export interface IUser {
  id: number;
  login: string;
  email: string;
  fullName: string;
  role: RoleCode;
  roleName: string;
  companyId?: string;
  companyName?: string;
  isHeadOfCompany: boolean;
  programmes: number[];
  baseUrl?: string;
}
