import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { NotificationService } from '../shared/notification.service';
import { BaseBackendService } from '../shared/services';
import { BackendResource } from '../shared/decorators';
import { VmModel } from './vm.model';

@Injectable()
@BackendResource({
  entity: 'VirtualMachine',
  entityModel: VmModel
})
export class VmService extends BaseBackendService<VmModel> {
  constructor(protected http: Http,
    protected notification: NotificationService) {
    super(http, notification);
   }
}
