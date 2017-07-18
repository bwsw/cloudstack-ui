import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';
import clone = require('lodash/clone');


@Component({
  selector: 'cs-vm-tags',
  templateUrl: 'vm-tags.component.html'
})
export class VmTagsComponent {
  @Input() public vm: VirtualMachine;

  constructor(private vmService: VmService) {}

  public updateVm(): void {
    this.vmService.get(this.vm.id)
      .subscribe(vm => {
        const updatedVm = clone(this.vm);
        updatedVm.tags = vm.tags;
        this.vm = updatedVm;
      });
  }
}
