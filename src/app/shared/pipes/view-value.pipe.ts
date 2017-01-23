import { Pipe, PipeTransform } from '@angular/core';

/*
 * Return Yes/No instead of true/false or passed value
*/
@Pipe({
  // tslint:disable-next-line
  name: 'viewValue'
})
export class ViewValuePipe implements PipeTransform {
  public transform(value: any): any {
    switch (value) {
      case true: return 'Yes';
      case false: return 'No';
      default: return value;
    }
  }
}
