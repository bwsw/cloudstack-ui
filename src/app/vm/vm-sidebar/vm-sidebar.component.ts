import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { SnackBarService } from '../../core/services';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';

@Component({
  selector: 'cs-vm-sidebar',
  templateUrl: 'vm-sidebar.component.html',
  styleUrls: ['vm-sidebar.component.scss'],
})
export class VmSidebarComponent extends SidebarComponent<VirtualMachine> {
  @Input()
  public entity: VirtualMachine;
  @Output()
  public colorChanged = new EventEmitter();

  constructor(
    protected vmService: VmService,
    protected notificationService: SnackBarService,
    protected route: ActivatedRoute,
    protected router: Router,
  ) {
    super(vmService, notificationService, route, router);
  }
}
