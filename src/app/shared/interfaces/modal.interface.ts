import { Action } from '../enums';

export interface IModal<T> {
  model: T;
  action: Action;
}
