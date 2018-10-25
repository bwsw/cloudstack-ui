import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/*
 * Return Yes/No instead of true/false or passed value
 */
@Pipe({
  // tslint:disable-next-line
  name: 'viewValue',
})
export class ViewValuePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  public transform(value: any): Observable<string> {
    return this.translateService.get(['COMMON.YES', 'COMMON.NO']).pipe(
      map(strings => {
        switch (value) {
          case true:
            return strings['COMMON.YES'];
          case false:
            return strings['COMMON.NO'];
          default:
            return value;
        }
      }),
    );
  }
}
