import { SocialIndicatorType } from './social-indicators.enum';

export interface ISiteVisit {
  visitDate: Date;
}

export interface ISiteVisitObject {
  visitDate: Date | string;
  url: string;
  type: SocialIndicatorType;
}

export interface ISiteVisits extends ISiteVisit {
  lastModified: Date;
}

export interface ISocialIndicatorOption {
  name: string;
  url: string;
  type: SocialIndicatorType;
}

export interface ISocialIndicatorTopicControl {
  name: string;
  label: string;
  placeholder: string;
  regExp: RegExp;
  tooltip: string;
}
