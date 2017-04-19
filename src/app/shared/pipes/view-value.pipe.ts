import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

/*
 * Return Yes/No instead of true/false or passed value
 */
@Pipe({
  // tslint:disable-next-line
  name: 'viewValue'
})
export class ViewValuePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  public transform(value: any): Observable<string> {
    return this.translateService.get(['YES', 'NO'])
      .map(strings => {
        switch (value) {
          case true: return strings['YES'];
          case false: return strings['NO'];
          default: return value;
        }
      });
  }
}
