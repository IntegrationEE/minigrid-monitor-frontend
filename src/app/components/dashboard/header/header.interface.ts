import { GridConnection, RenewableTechnology } from '@shared/enums';
import { ILight } from '@shared/interfaces';

export interface IFilterLight extends ILight {
  siteIds: number[];
  disabled: boolean;
  selected: boolean;
}

export interface ISiteLight extends ILight {
  renewableCapacity: number;
  renewableTechnology: RenewableTechnology;
  gridConnection?: GridConnection;
}

export interface ISiteList {
  id: number;
  name: string;
  state: string;
  programme: string;
  company: string;
  renewableCapacity: string;
  lat: number;
  long: number;
}
