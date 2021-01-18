import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash';

@Pipe({
  name: 'customNumber',
})
export class CustomNumberPipe implements PipeTransform {
  transform(value: number): string {
    return !isNil(value) ? String(value).replace(/(?!^)(?=(?:\d{3})+$)/g, ' ') : '';
  }
}
