import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { BackendResource } from '../../shared/decorators';
import { CSCommands } from '../../shared/services/base-backend.service';
import { Template } from './template.model';
import {
  BaseTemplateService,
  CreateTemplateBaseParams,
  RegisterTemplateBaseParams,
  templateResourceType,
} from './base-template.service';

@Injectable()
@BackendResource({
  entity: templateResourceType.template,
})
export class TemplateService extends BaseTemplateService {
  public create(params: CreateTemplateBaseParams): Observable<Template> {
    return this.sendCommand(CSCommands.Create, params).pipe(
      switchMap(job => this.asyncJobService.queryJob(job, this.entity)),
      switchMap(template => {
        if (params.groupId) {
          return this.templateTagService.setGroup(template, { id: params.groupId });
        }
        return of(template);
      }),
      tap(() => this.invalidateCache()),
    );
  }

  public register(params: RegisterTemplateBaseParams): Observable<Template> {
    const requestParams = { ...params };

    requestParams['hypervisor'] = requestParams['hypervisor'] || 'KVM';
    requestParams['format'] = requestParams['format'] || 'QCOW2';
    requestParams['requiresHvm'] = requestParams['requiresHvm'] || true;

    return super.register(requestParams).pipe(tap(() => this.invalidateCache())) as Observable<
      Template
    >;
  }
}
