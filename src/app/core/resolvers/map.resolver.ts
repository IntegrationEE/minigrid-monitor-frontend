import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { StateService } from '@core/services';
import { IStateMap } from '@shared/interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class MapResolver implements Resolve<IStateMap[]> {
  constructor(private service: StateService) { }

  resolve(): Observable<IStateMap[]> {
    return this.service.getListForMap();
  }
}
