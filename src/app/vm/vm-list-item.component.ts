import { Component, Input, Output, EventEmitter } from '@angular/core';

import { VirtualMachine } from './vm.model';


@Component({
  selector: 'cs-vm-list-item',
  templateUrl: './vm-list-item.component.html',
  styleUrls: ['./vm-list-item.component.scss']
})
export class VmListItemComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onVmAction = new EventEmitter();

  public start() {
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'start',
      vm: this.vm
    });
  }

  public stop() {
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'stop',
      vm: this.vm
    });
  }

  public reboot() {
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'reboot',
      vm: this.vm
    });
  }

  public restore() {
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'restore',
      vm: this.vm,
      templateId: this.vm.templateId,
    });
  }

  public destroy() {
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'destroy',
      vm: this.vm
    });
  }
}
