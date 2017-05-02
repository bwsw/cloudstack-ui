import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { OsTypeService } from '../../shared/services/os-type.service';
import { Template } from './template.model';
import { BaseTemplateService } from './base-template.service';
import { UtilsService } from '../../shared/services/utils.service';
import { TemplateFormData } from '../template-creation/template-creation.component';
import { Subject } from 'rxjs/Subject';


@Injectable()
@BackendResource({
  entity: 'Template',
  entityModel: Template
})
export class TemplateService extends BaseTemplateService {
  public templateUpdates: Subject<void>;

  constructor (
    protected asyncJobService: AsyncJobService,
    protected osTypeService: OsTypeService,
    protected utilsService: UtilsService
  ) {
    super(asyncJobService, osTypeService, utilsService);
    this.templateUpdates = new Subject<void>();
  }

  public create(data: TemplateFormData): Observable<Template> {
    return this.sendCommand('create', data.getParams())
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel))
      .map(result => {
        this.invalidateCache();
        this.templateUpdates.next();
        return result;
      });
  }
}
