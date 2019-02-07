import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';

import { ChangeVmUserData } from '../../../../reducers/vm/redux/vm.actions';
import { isVMUserDataValid, VirtualMachine } from '../../../shared/vm.model';
import { State } from '../../../../root-store';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-vm-user-data-dialog',
  templateUrl: './vm-user-data-dialog.component.html',
  styleUrls: ['./vm-user-data-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VmUserDataDialogComponent {
  public isEditMode = false;
  public form: FormGroup = new FormGroup({
    userdata: new FormControl({ value: this.vm.userdata, disabled: !this.isEditMode }),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public vm: VirtualMachine,
    public dialogRef: MatDialogRef<VmUserDataDialogComponent>,
    private store: Store<State>,
    private dialogService: DialogService,
  ) {}

  public onEdit() {
    this.isEditMode = true;
    this.form.controls['userdata'].enable();
  }

  public onSubmit() {
    if (!isVMUserDataValid(this.userData)) {
      this.dialogService.alert({ message: 'ERRORS.VM.USER_DATA_TOO_BIG' });
    } else {
      this.store.dispatch(
        new ChangeVmUserData({
          vm: this.vm,
          userdata: this.userData,
        }),
      );
      this.isEditMode = false;
      this.form.controls['userdata'].disable();
    }
  }

  private get userData(): string {
    return this.form.getRawValue()['userdata'];
  }
}
