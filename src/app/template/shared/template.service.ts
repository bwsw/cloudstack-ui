import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { OsTypeService } from '../../shared/services/os-type.service';
import { Template } from './template.model';
import { BaseTemplateService, RegisterTemplateBaseParams } from './base-template.service';


@Injectable()
@BackendResource({
  entity: 'Template',
  entityModel: Template
})
export class TemplateService extends BaseTemplateService {
  constructor (
    protected asyncJobService: AsyncJobService,
    protected osTypeService: OsTypeService
  ) {
    super(asyncJobService, osTypeService);
  }

  public create(params: RegisterTemplateBaseParams): Observable<Template> {
    return super.create(params);
  }

  public register(params: RegisterTemplateBaseParams): Observable<Template> {
    // stub
    params['hypervisor'] = 'KVM';
    params['format'] = 'QCOW2';
    params['requiresHvm'] = true;

    return super.register(params);
  }
}
