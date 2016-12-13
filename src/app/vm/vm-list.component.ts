import { Component, OnInit } from '@angular/core';

import { VmService } from './vm.service';
import { VirtualMachine } from './vm.model';

@Component({
  selector: 'cs-vm-list',
  templateUrl: './vm-list.component.html'
})
export class VmListComponent implements OnInit {
  private vmList: Array<VirtualMachine>;

  constructor (private vmService: VmService) { }

  public ngOnInit() {
    this.vmService.getList()
      .then(vmList => this.vmList = vmList);
  }
}
