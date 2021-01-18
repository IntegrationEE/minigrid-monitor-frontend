export interface IUserDetailsModel {
  id: number;
  fullName: string;
  email: string;
  city: string;
  street: string;
  number: string;
  state: string;
  phoneNumber: string;
  localGovernmentArea: string;
  localGovernmentAreaId: number;
  stateId: number;
}

export interface IUserDetailsUpdateModel {
  fullName: string;
  city: string;
  street: string;
  number: string;
  phoneNumber: string;
  localGovernmentAreaId: number;
  stateId: number;
}

export interface IChangePasswordModel {
  newPassword: string;
  currentPassword: string;
}
