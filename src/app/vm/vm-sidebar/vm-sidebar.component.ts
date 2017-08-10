import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';


@Component({
  selector: 'cs-vm-sidebar',
  templateUrl: 'vm-sidebar.component.html',
  styleUrls: ['vm-sidebar.component.scss']
})
export class VmSidebarComponent {
  @Input() public vm: VirtualMachine;
  public vmNotFound: boolean;

  constructor(
    private vmService: VmService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    this.vmNotFound = false;
    this.route.params.pluck('id')
      .filter(id => !!id)
      .switchMap((id: string) => this.vmService.getWithDetails(id))
      .subscribe(
        vm => {
          if (vm) {
            this.vm = vm;
          } else {
            this.vmNotFound = true;
          }
        },
        (error) => this.notificationService.error(error.message));
  }
}
