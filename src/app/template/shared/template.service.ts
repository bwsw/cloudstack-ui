import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { Template } from './template.model';
import {
  BaseTemplateService,
  CreateTemplateBaseParams,
  RegisterTemplateBaseParams,
  TemplateResourceType
} from './base-template.service';


@Injectable()
@BackendResource({
  entity: TemplateResourceType.template,
})
export class TemplateService extends BaseTemplateService {
  public create(params: CreateTemplateBaseParams): Observable<Template> {
    return this.sendCommand('create', params)
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel))
      .switchMap(template => {
        if (params.groupId) {
          return this.templateTagService.setGroup(template, { id: params.groupId });
        } else {
          return Observable.of(template);
        }
      })
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
