import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

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
    return this.getRequest('attach', {
      virtualMachineId: vmId,
      id: iso.id
    })
      .switchMap(response => {
        return this.asyncJobService.addJob(response['attachisoresponse'].jobid);
      })
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2) {
          return Observable.throw(jobResult.jobResult.errortext);
        }
        return Observable.of(iso);
      });
  }

  public detach(id: string): Observable<any> {
    return this.getRequest('detach', {
      virtualMachineId: id
    })
      .switchMap(response => {
        return this.asyncJobService.addJob(response['detachisoresponse'].jobid);
      })
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2) {
          return Observable.throw(jobResult.jobResult.errortext);
        }
        return Observable.of(null);
      });
  }
}
