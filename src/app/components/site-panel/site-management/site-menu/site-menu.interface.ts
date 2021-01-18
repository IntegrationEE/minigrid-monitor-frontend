import { SiteMenuMode, SiteMenuPage } from './site-menu.enum';

export interface ISiteMenuOption {
  status: 'red' | 'green' | 'orange';
  label: string;
  page: SiteMenuPage;
}

export interface ISiteMenu {
  siteId: number;
  mode: SiteMenuMode;
}

export interface ISiteStatus {
  siteInfo: 'red' | 'green' | 'orange';
  technicalSpec: 'red' | 'green' | 'orange';
  financialDetails: 'red' | 'green' | 'orange';
  technicalIndicators: 'red' | 'green' | 'orange';
  socialIndicators: 'red' | 'green' | 'orange';
  financialIndicators: 'red' | 'green' | 'orange';
}
