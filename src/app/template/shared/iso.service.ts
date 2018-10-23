import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { CSCommands } from '../../shared/services/base-backend.service';
import { BaseTemplateService, templateResourceType } from './base-template.service';
import { VirtualMachine } from '../../vm/shared/vm.model';

@Injectable()
@BackendResource({
  entity: templateResourceType.iso,
})
export class IsoService extends BaseTemplateService {
  public attach(params: any): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.Attach, params).pipe(
      switchMap(iso => this.asyncJobService.queryJob(iso, 'VirtualMachine')),
    );
  }

  public detach(params: any): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.Detach, params).pipe(
      switchMap(iso => this.asyncJobService.queryJob(iso, 'VirtualMachine')),
    );
  }
}
