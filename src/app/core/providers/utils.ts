import { Injectable } from '@angular/core';
import { Action } from '@shared/enums';
import { IFilter } from '@shared/interfaces';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  getActionName(action: Action) {
    return Action[action].charAt(0).toUpperCase() + Action[action].slice(1).toLowerCase();
  }

  clearRequest(data: IFilter): IFilter {
    const filters: IFilter = { ...data};

    delete filters.state_names;

    return filters;
  }

  getUtcDate(date: Date): string {
    return moment(date).startOf('day').format('yyyy-MM-DD');
  }
}
