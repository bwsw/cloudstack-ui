import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../../vm/shared/vm.model';
import { SecurityGroupViewMode } from '../../sg-view-mode';

@Component({
  selector: 'cs-security-group-vm-list',
  templateUrl: 'security-group-vm-list.component.html',
  styleUrls: ['security-group-vm-list.component.scss'],
})
export class SecurityGroupVmListComponent {
  @Input()
  public vmList: VirtualMachine[];
  @Input()
  public viewMode: SecurityGroupViewMode;

  public get isModePrivate(): boolean {
    return this.viewMode === SecurityGroupViewMode.Private;
  }

  public get isModeShared(): boolean {
    return this.viewMode === SecurityGroupViewMode.Shared;
  }

  public getVmLink(vm: VirtualMachine) {
    return `/instances/${vm.id}/vm`;
  }

  public showVMList(): boolean {
    return this.viewMode !== SecurityGroupViewMode.Templates;
  }
}
