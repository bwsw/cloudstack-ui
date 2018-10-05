import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { CSCommands } from '../../shared/services/base-backend.service';
import { BaseTemplateService, TemplateResourceType } from './base-template.service';
import { VirtualMachine } from '../../vm/shared/vm.model';

@Injectable()
@BackendResource({
  entity: TemplateResourceType.iso,
})
export class IsoService extends BaseTemplateService {
  public attach(params: any): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.Attach, params).pipe(
      switchMap(job => this.asyncJobService.queryJob(job, 'VirtualMachine')),
      map(result => result.jobresult.virtualmachine));
  }

  public detach(params: any): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.Detach, params).pipe(
      switchMap(job => this.asyncJobService.queryJob(job, 'VirtualMachine')),
      map(result => result.jobresult.virtualmachine));
  }
}
