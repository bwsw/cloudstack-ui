import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Template } from '../../../../app/template/shared';
import { GroupedTemplates } from '../../../../app/template/shared/base-template.service';


const templates: Array<Object> = require('../fixtures/templates.json');

@Injectable()
export class MockTemplateService {
  constructor(@Inject('mockTemplateServiceConfig') public config: { templates: any, groupedTemplates: any }) {}

  public getList(): Observable<Array<Template>> {
    return Observable.of(templates.map(json => new Template(json)));
  }

  public getGroupedTemplates(): Observable<GroupedTemplates<Template>> {
    return Observable.of(this.config.groupedTemplates);
  }
}
