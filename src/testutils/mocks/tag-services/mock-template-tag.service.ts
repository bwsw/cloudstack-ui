import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BaseTemplateModel } from '../../../app/template/shared/base-template.model';

@Injectable()
export class MockTemplateTagService {
  public getDownloadUrl(template: BaseTemplateModel): Observable<string> {
    return of('');
  }

  public setDownloadUrl(template, downloadUrl: string): Observable<BaseTemplateModel> {
    return of(template);
  }
}
