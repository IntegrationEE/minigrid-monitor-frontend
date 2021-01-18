import { ILight } from '@shared/interfaces';

export interface IProgrammeIndicator extends ILight {
  unit: string;
  description: string;
  target: string;
  isCumulative: boolean;
  programmeId: number;
}
