import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { NotificationService } from '../../shared/services/notification.service';


@Component({
  selector: 'cs-vm-sidebar',
  templateUrl: 'vm-sidebar.component.html',
  styleUrls: ['vm-sidebar.component.scss']
})
export class VmSidebarComponent {
  @Input() public vm: VirtualMachine;

  constructor(
    private vmService: VmService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    this.route.params.pluck('id')
      .filter(id => !!id)
      .switchMap((id: string) => this.vmService.getWithDetails(id))
      .subscribe(
        vm => this.vm = vm,
        (error) => this.notificationService.error(error.message)
      );
  }
}
