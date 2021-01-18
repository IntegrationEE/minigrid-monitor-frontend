import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ThresholdsService } from '@core/services';
import { IThreshold } from '@shared/interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class ThresholdsResolver implements Resolve<IThreshold[]> {
  constructor(private service: ThresholdsService) { }

  resolve(): Observable<IThreshold[]> {
    return this.service.getAll();
  }
}
