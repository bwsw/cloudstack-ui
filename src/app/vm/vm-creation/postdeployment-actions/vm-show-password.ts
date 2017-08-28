import { Injectable } from '@angular/core';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { Action } from '../../../shared/interfaces/action.interface';
import { VirtualMachine } from '../../shared/vm.model';

@Injectable()
export class VmShowPasswordAction implements Action<VirtualMachine> {
  public name = 'showPassword';

  constructor(private dialogService: DialogService) {}

  public canActivate(vm: VirtualMachine): boolean {
    return vm.passwordEnabled;
  }

  public activate(vm: VirtualMachine): void {
    this.dialogService.customAlert({
      message: {
        translationToken: 'DIALOG_MESSAGES.VM.PASSWORD_DIALOG_MESSAGE',
        interpolateParams: {
          vmName: vm.name,
          vmPassword: vm.password
        }
      },
      width: '400px',
      clickOutsideToClose: false
    });
  }
}
