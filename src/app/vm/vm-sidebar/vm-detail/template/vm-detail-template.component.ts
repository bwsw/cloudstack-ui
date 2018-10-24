import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../../shared/vm.model';

@Component({
  selector: 'cs-vm-detail-template',
  templateUrl: 'vm-detail-template.component.html',
})
export class VmDetailTemplateComponent {
  @Input()
  public vm: VirtualMachine;
}
