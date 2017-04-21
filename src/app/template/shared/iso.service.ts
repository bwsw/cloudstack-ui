import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { Iso } from './iso.model';
import { BaseTemplateService } from './base-template.service';


@Injectable()
@BackendResource({
  entity: 'Iso',
  entityModel: Iso
})
export class IsoService extends BaseTemplateService {
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
