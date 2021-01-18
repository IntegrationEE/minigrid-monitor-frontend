import { ConventionalTechnology, GridConnection, RenewableTechnology, StorageTechnology } from '@shared/enums';
import { ILight } from '@shared/interfaces';

export interface ISite extends ILight {
  stateId: number;
  stateName: string;
  companyId: number;
  companyName: string;
  programmeId: number;
  programmeName: string;
  lat: number;
  long: number;
  commissioningDate: Date;
}

export interface ISiteTechnicalParameter {
  id: number;
  siteId: number;
  renewableTechnology: RenewableTechnology;
  renewableCapacity: number;
  storageTechnology: StorageTechnology;
  storageCapacity: number;
  conventionalTechnology: ConventionalTechnology;
  conventionalCapacity: number;
  meteringTypeId: number;
  inverterManufacturer: string;
  meterManufacturer: string;
  gridLength: number;
  gridConnection: GridConnection;
}

export interface ISiteFinancialParameter {
  id: number;
  siteId: number;
  generation: number;
  siteDevelopment: number;
  logistics: number;
  distribution: number;
  customerInstallation: number;
  commissioning: number;
  taxes: number;
  financingGrant: number;
  financingEquity: number;
  financingDebt: number;
}
