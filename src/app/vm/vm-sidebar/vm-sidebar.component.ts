import { Component, Input } from '@angular/core';

import { VirtualMachine } from '../shared/vm.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'cs-vm-sidebar',
  templateUrl: 'vm-sidebar.component.html'
})
export class VmSidebarComponent {
  @Input() public vm: VirtualMachine;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      console.log(params);
    });
  }
}
