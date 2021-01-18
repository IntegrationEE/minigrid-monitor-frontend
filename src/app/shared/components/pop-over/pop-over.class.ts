import { OverlayRef } from '@angular/cdk/overlay';
import { TemplateRef, Type } from '@angular/core';
import { Subject } from 'rxjs';

import { PopoverCloseEvent } from './pop-over.interface';

export type PopoverContent = TemplateRef<any> | Type<any> | string;

export class PopoverRef<T = any> {
  afterClosed = new Subject<PopoverCloseEvent<T>>();
  afterClosed$ = this.afterClosed.asObservable();

  constructor(public overlay: OverlayRef,
              public content: PopoverContent,
              public data: T) {
    overlay.backdropClick().subscribe(() => {
      this.closeOverlay('backdropClick', null);
    });
  }

  close(data?: T) {
    this.closeOverlay('close', data);
  }

  private closeOverlay(type: PopoverCloseEvent['type'], data?: T) {
    this.overlay.dispose();
    this.afterClosed.next({
      type,
      data,
    });
    this.afterClosed.complete();
  }
}
