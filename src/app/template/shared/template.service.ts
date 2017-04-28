import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { OsTypeService } from '../../shared/services/os-type.service';
import { Template } from './template.model';
import { BaseTemplateService } from './base-template.service';
import { UtilsService } from '../../shared/services/utils.service';
import { TemplateFormData } from '../template-creation/template-creation.component';


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

  public create(data: TemplateFormData): Observable<Template> {
    return this.sendCommand('create', data.getParams())
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel))
      .map(() => {
        throw { message: 'asd' };
      });
  }
}
