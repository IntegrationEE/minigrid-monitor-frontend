import { ThresholdCode } from '@shared/enums';

export interface IThreshold {
  id: number;
  code: ThresholdCode;
  name: string;
  min: number;
  max: number;
}
