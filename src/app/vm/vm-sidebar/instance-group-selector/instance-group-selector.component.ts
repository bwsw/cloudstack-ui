import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Mode } from '../../../shared/components/create-update-delete-dialog/create-update-delete-dialog.component';
import { InstanceGroup } from '../../../shared/models';
import { getInstanceGroupName, VirtualMachine } from '../../shared/vm.model';

@Component({
  selector: 'cs-instance-group-selector',
  templateUrl: 'instance-group-selector.component.html',
  styleUrls: ['instance-group-selector.component.scss'],
})
export class InstanceGroupSelectorComponent {
  public groupNames: string[];
  public vm: VirtualMachine;
  public loading: boolean;
  public modes = Mode;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<InstanceGroupSelectorComponent>,
  ) {
    this.groupNames = data.groups;
    this.vm = data.vm;
  }

  public get groupName(): string {
    return getInstanceGroupName(this.vm);
  }

  public changeGroup(name: string): void {
    this.loading = true;
    const instanceGroup = new InstanceGroup(name);
    this.dialogRef.close(instanceGroup);
  }

  public removeGroup(): void {
    this.changeGroup('');
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
