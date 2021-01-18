import { OverviewMode } from '@dashboard/dashboard.enum';
import { GridConnection, RenewableTechnology } from '@shared/enums';

export interface IFilter {
  siteId?: number;
  state_names: string[];
  states: number[];
  programmes: number[];
  companies: number[];
  from: number;
  to: number;
  technologies: RenewableTechnology[];
  level?: OverviewMode;
  gridConnections: GridConnection[];
}
