import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { BackendResource } from '../../shared/decorators';
import { CSCommands } from '../../shared/services/base-backend.service';
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
    return this.sendCommand(CSCommands.Create, params).pipe(
      switchMap(job => this.asyncJobService.queryJob(job, this.entity)),
      tap(() => this.invalidateCache()));
  }

  public register(params: RegisterTemplateBaseParams): Observable<Template> {
    const requestParams = Object.assign({}, params);

    requestParams['hypervisor'] = requestParams['hypervisor'] || 'KVM';
    requestParams['format'] = requestParams['format'] || 'QCOW2';
    requestParams['requiresHvm'] = requestParams['requiresHvm'] || true;

    return <Observable<Template>>super.register(requestParams).pipe(
      tap(() => this.invalidateCache()));
  }
}
