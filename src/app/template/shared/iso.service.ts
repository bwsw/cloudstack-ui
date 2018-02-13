import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { CSCommands } from '../../shared/services/base-backend.service';
import { Iso } from './iso.model';
import { BaseTemplateService, TemplateResourceType } from './base-template.service';
import { VirtualMachine } from '../../vm/shared/vm.model';

@Injectable()
@BackendResource({
  entity: TemplateResourceType.iso,
  entityModel: Iso
})
export class IsoService extends BaseTemplateService {
  public attach(params: any): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.Attach, params)
      .switchMap(job => this.asyncJobService.queryJob(job, 'VirtualMachine', VirtualMachine));
  }

  public detach(params: any): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.Detach, params)
      .switchMap(job => this.asyncJobService.queryJob(job, 'VirtualMachine', VirtualMachine));
  }
}
