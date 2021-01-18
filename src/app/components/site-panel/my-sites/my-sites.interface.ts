import { ConventionalTechnology, GridConnection, RenewableTechnology, SiteStatus } from '@shared/enums';

export interface ISiteCard {
  id: number;
  name: string;
  stateName: string;
  renewableCapacity: number;
  renewableTechnology: RenewableTechnology;
  gridConnection: GridConnection;
  status: SiteStatus;
  conventionalTechnology: ConventionalTechnology;
  // frontend properties
  statusClass: string;
  statusTooltip: string;
  renewableTechnologyIcon: string;
  conventionalTechnologyIcon: string;
  gridConnectionIcon: string;
  isPublished: boolean;
}
