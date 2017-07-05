import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Template } from '../../../../app/template/shared';


const templates: Array<Object> = require('../fixtures/templates.json');

@Injectable()
export class MockTemplateService {
  public getList(): Observable<Array<Template>> {
    return Observable.of(templates.map(json => new Template(json)));
  }
}
