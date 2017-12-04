import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
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
    return this.sendCommand('attach', params)
      .switchMap(job => this.asyncJobService.queryJob(job, 'VirtualMachine', VirtualMachine));
  }

  public detach(params: any): Observable<VirtualMachine> {
    return this.sendCommand('detach', params)
      .switchMap(job => this.asyncJobService.queryJob(job, 'VirtualMachine', VirtualMachine));
  }
}
