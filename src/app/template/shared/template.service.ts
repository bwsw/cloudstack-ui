import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { Template } from './template.model';
import { BaseTemplateService, RegisterTemplateBaseParams } from './base-template.service';


@Injectable()
@BackendResource({
  entity: 'Template',
  entityModel: Template
})
export class TemplateService extends BaseTemplateService {
  public create(params: {}): Observable<Template> {
    return this.sendCommand('create', params)
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel))
      .do(() => this.invalidateCache());
  }

  public register(params: RegisterTemplateBaseParams): Observable<Template> {
    // stub

    const requestParams = Object.assign({}, params);

    requestParams['hypervisor'] = requestParams['hypervisor'] || 'KVM';
    requestParams['format'] = requestParams['format'] || 'QCOW2';
    requestParams['requiresHvm'] = requestParams['requiresHvm'] || true;

    return <Observable<Template>>super.register(requestParams)
      .do(() => this.invalidateCache());
  }
}
