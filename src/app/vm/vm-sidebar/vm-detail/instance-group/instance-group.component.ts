import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';

import { VirtualMachine } from '../../../shared/vm.model';
import { InstanceGroupSelectorComponent } from '../../instance-group-selector/instance-group-selector.component';

@Component({
  selector: 'cs-instance-group',
  templateUrl: 'instance-group.component.html',
  styleUrls: ['instance-group.component.scss'],
})
export class InstanceGroupComponent {
  @Input()
  public vm: VirtualMachine;
  @Input()
  public groupNames: string[];
  @Output()
  public groupChanged = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  public changeGroup(): void {
    this.dialog
      .open(InstanceGroupSelectorComponent, {
        width: '400px',
        data: { vm: this.vm, groups: this.groupNames },
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(group => this.groupChanged.emit(group));
  }
}
