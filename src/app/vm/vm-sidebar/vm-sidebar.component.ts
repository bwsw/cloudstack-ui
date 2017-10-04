import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NotificationService } from '../../shared/services/notification.service';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { EntityDoesNotExistError } from '../../shared/components/sidebar/entity-does-not-exist-error';


@Component({
  selector: 'cs-vm-sidebar',
  templateUrl: 'vm-sidebar.component.html',
  styleUrls: ['vm-sidebar.component.scss']
})
export class VmSidebarComponent extends SidebarComponent<VirtualMachine> {

  constructor(
    protected vmService: VmService,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(vmService, notificationService, route, router);
  }

  protected loadEntity(id: string): Observable<VirtualMachine> {
    return this.vmService.getWithDetails(id)
      .switchMap(vm => {
        if (vm) {
          return Observable.of(vm);
        } else {
          return Observable.throw(new EntityDoesNotExistError());
        }
      });
  }
}
