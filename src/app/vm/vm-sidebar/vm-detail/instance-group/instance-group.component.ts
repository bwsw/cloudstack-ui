import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';

import { getInstanceGroupName, VirtualMachine } from '../../../shared/vm.model';
import { InstanceGroupSelectorComponent } from '../../instance-group-selector/instance-group-selector.component';
import { InstanceGroup } from '../../../../shared/models/instance-group.model';

@Component({
  selector: 'cs-instance-group',
  templateUrl: 'instance-group.component.html',
  styleUrls: ['instance-group.component.scss'],
})
export class InstanceGroupComponent {
  @Input()
  public vm: VirtualMachine;
  @Input()
  public groups: InstanceGroup[];
  @Output()
  public groupChanged = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  public get groupName(): string {
    return getInstanceGroupName(this.vm);
  }

  public changeGroup(): void {
    const groupNames = this.groups.map(group => group.name);
    this.dialog
      .open(InstanceGroupSelectorComponent, {
        width: '400px',
        data: { vm: this.vm, groups: groupNames },
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(group => this.groupChanged.emit(group));
  }
}
