import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../../../shared/decorators/backend-resource.decorator';
import { BaseTemplateService } from '../base/base-template.service';
import { Iso } from './iso.model';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { IsoTagService } from '../../../shared/services/tags/template/iso/iso-tag.service';
import { OsTypeService } from '../../../shared/services/os-type.service';
import { InstanceGroup } from '../../../shared/models/instance-group.model';


@Injectable()
@BackendResource({
  entity: 'Iso',
  entityModel: Iso
})
export class IsoService extends BaseTemplateService<Iso> {
  constructor(
    protected asyncJobService: AsyncJobService,
    protected isoTagService: IsoTagService,
    protected osTypeService: OsTypeService
  ) {
    super(asyncJobService, isoTagService, osTypeService);
  }

  public attach(vmId: string, iso: Iso): Observable<Iso> {
    return this.sendCommand('attach', {
      virtualMachineId: vmId,
      id: iso.id
    })
      .switchMap(job => this.asyncJobService.queryJob(job.jobid))
      .map(() => iso);
  }

  public detach(id: string): Observable<any> {
    return this.sendCommand('detach', { virtualMachineId: id })
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
  }
}
