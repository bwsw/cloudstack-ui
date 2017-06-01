import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { OsTypeService } from '../../shared/services/os-type.service';
import { Template } from './template.model';
import { BaseTemplateService, RegisterTemplateBaseParams } from './base-template.service';
import { UtilsService } from '../../shared/services/utils.service';


@Injectable()
@BackendResource({
  entity: 'Template',
  entityModel: Template
})
export class TemplateService extends BaseTemplateService {
  constructor (
    protected asyncJobService: AsyncJobService,
    protected osTypeService: OsTypeService,
    protected utilsService: UtilsService
  ) {
    super(asyncJobService, osTypeService, utilsService);
  }

  public create(params: {}): Observable<Template> {
    return this.sendCommand('create', params)
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel))
      .do(() => this.invalidateCache());
  }

  public register(params: RegisterTemplateBaseParams): Observable<Template> {
    // stub
    params['hypervisor'] = 'KVM';
    params['format'] = 'QCOW2';
    params['requiresHvm'] = true;

    return super.register(params)
      .do(() => this.invalidateCache());
  }
}
