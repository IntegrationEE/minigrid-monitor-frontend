export interface ICompany {
  id: number;
  name: string;
  city: string;
  street: string;
  number: string;
  stateId: number;
  stateName?: string;
  localGovernmentAreaId: number;
  localGovernmentAreaName?: string;
  websiteUrl: string;
  phoneNumber: string;
}
