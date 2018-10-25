import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../../shared/vm.model';

@Component({
  selector: 'cs-zone',
  templateUrl: 'zone.component.html',
})
export class VmDetailZoneComponent {
  @Input()
  public vm: VirtualMachine;
}
