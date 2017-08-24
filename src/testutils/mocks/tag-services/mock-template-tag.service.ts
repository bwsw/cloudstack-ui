import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateModel } from '../../../app/template/shared/base-template.model';


@Injectable()
export class MockTemplateTagService {
  public getDownloadUrl(template: BaseTemplateModel): Observable<string> {
    return Observable.of('');
  }

  public setDownloadUrl(template, downloadUrl: string): Observable<BaseTemplateModel> {
    return Observable.of(template);
  }
}
