import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../../../shared/decorators/backend-resource.decorator';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { OsTypeService } from '../../../shared/services/os-type.service';
import { TemplateTagService } from '../../../shared/services/tags/template/template/template-tag.service';
import { BaseTemplateService, RegisterTemplateBaseParams } from '../base/base-template.service';
import { Template } from './template.model';


@Injectable()
@BackendResource({
  entity: 'Template',
  entityModel: Template
})
export class TemplateService extends BaseTemplateService<Template> {
  constructor(
    protected asyncJobService: AsyncJobService,
    protected baseTemplateTagService: TemplateTagService,
    protected osTypeService: OsTypeService
  ) {
    super(asyncJobService, baseTemplateTagService, osTypeService);
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

    return <Observable<Template>>super.register(params)
      .do(() => this.invalidateCache());
  }
}
