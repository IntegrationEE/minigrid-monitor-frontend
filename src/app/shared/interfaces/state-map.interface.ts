import { ILight } from './light.interface';

export interface IStateMap extends ILight {
  coordinates: number[][][];
}
