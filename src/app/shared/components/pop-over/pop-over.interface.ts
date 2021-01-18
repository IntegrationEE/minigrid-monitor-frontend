import { PopoverContent } from './pop-over.class';

export interface PopoverParams<T> {
  width?: string | number;
  height?: string | number;
  origin: HTMLElement;
  content: PopoverContent;
  data?: T;
}

export interface PopoverCloseEvent<T = any> {
  type: 'backdropClick' | 'close';
  data: T;
}

export interface IPopoverConfig {
  origin: HTMLElement;
  width: string | number;
  height: string | number;
}
