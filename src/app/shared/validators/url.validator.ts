import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isUrl, UrlConfig } from '../utils/isUrl';

export { UrlConfig } from '../utils/isUrl'

export function urlValidator(config?: UrlConfig): ValidatorFn {
  return (control: AbstractControl): ValidationErrors => {
    return isUrl(control.value, config) ? null : {'url': {value: control.value}};
  }
}
