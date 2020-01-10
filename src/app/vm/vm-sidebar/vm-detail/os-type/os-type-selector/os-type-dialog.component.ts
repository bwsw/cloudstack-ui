import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { OsTypeService } from '../../../../../shared/services/os-type.service';
import { VirtualMachine, VmState } from '../../../../shared/vm.model';

export interface OsTypeSelectorDialogData {
  vm: VirtualMachine;
}

@Component({
  templateUrl: './os-type-dialog.component.html',
  styleUrls: ['./os-type-dialog.component.scss'],
})
export class OsTypeDialogComponent {
  public osTypeId: string;
  public readonly initialOsTypeId: string;
  public readonly rebootRequired: boolean;

  public readonly osTypes$ = this.osTypeService.getList();

  public get valueChanged() {
    return this.osTypeId !== this.initialOsTypeId;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: OsTypeSelectorDialogData,
    private osTypeService: OsTypeService,
  ) {
    this.initialOsTypeId = this.osTypeId = data.vm.guestosid;
    this.rebootRequired = data.vm.state === VmState.Running;
  }
}
