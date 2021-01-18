import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  hasError(form: FormGroup, controlName: string): boolean {
    return form.controls[controlName].touched && form.controls[controlName].errors !== null;
  }

  getError(form: FormGroup, controlName: string): string {
    const error: ValidationErrors = form.controls[controlName].errors;

    if (error) {
      const input: HTMLElement = document.getElementById(controlName);
      const label: string = input && (input as HTMLInputElement).labels && (input as HTMLInputElement).labels.length ?
        (input as HTMLInputElement).labels[0].textContent :
        controlName;

      if (error.required) {
        return `${label} is required.`;
      } else if (error.min) {
        return `${label} is out of range. Min: ${error.min.min}`;
      } else if (error.max) {
        return `${label} is out of range. Max: ${error.max.max}`;
      } else if (error.pattern) {
        return `${label} is incorrect format. Allowed format: ${error.pattern.requiredPattern}.`;
      }
    }
  }
}
