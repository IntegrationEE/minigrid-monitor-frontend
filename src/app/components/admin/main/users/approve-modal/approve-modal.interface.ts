import { RoleCode } from '@shared/enums';

export interface IApprove {
  role: RoleCode;
  programmes: number[];
  isHeadOfCompany: boolean;
}
