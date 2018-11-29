import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Mode } from '../../../shared/components/create-update-delete-dialog/create-update-delete-dialog.component';
import { VirtualMachine } from '../../shared/vm.model';

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

  public changeGroup(instanceGroup: string): void {
    this.loading = true;
    this.dialogRef.close(instanceGroup);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
