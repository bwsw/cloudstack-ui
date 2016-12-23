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
  @Output() public onClick = new EventEmitter();

  public handleClick(e: MouseEvent) {
    e.stopPropagation();
    this.onClick.emit(this.vm);
  }

  public start(e: MouseEvent) {
    e.stopPropagation();
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'start',
    });
  }

  public stop(e: MouseEvent) {
    e.stopPropagation();
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'stop'
    });
  }

  public reboot(e: MouseEvent) {
    e.stopPropagation();
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'reboot'
    });
  }

  public restore(e: MouseEvent) {
    e.stopPropagation();
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'restore',
      templateId: this.vm.templateId
    });
  }

  public destroy(e: MouseEvent) {
    e.stopPropagation();
    this.onVmAction.emit({
      id: this.vm.id,
      action: 'destroy'
    });
  }
}
