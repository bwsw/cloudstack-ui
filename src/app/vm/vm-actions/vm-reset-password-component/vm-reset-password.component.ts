import {
  Component,
  Inject
} from '@angular/core';
import {
  MD_DIALOG_DATA,
  MdDialogRef
} from '@angular/material';
import { VmSavePasswordAction } from '../vm-save-password';
import { VirtualMachine } from '../../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';

@Component({
  selector: 'cs-vm-reset-password',
  templateUrl: 'vm-reset-password.component.html'
})
export class VmResetPasswordComponent {
  public message;
  public vm: VirtualMachine;
  public showSaveButton: boolean;

  constructor(
    public dialogRef: MdDialogRef<VmResetPasswordComponent>,
    private vmSavePassword: VmSavePasswordAction,
    private translateService: TranslateService,
    private userTagService: UserTagService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    this.vm = data;
    this.message = {
        translationToken: 'DIALOG_MESSAGES.VM.PASSWORD_DIALOG_MESSAGE',
        interpolateParams: {
          vmName: this.vm.name,
          vmPassword: this.vm.password,
        }
      };
    this.userTagService.getSavePasswordForAllVms()
      .subscribe(tag => {
        this.showSaveButton = !tag;
      });

  }

  public get translatedMessage(): Observable<string> {
    return this.translateService.get(
      this.message.translationToken,
      this.message.interpolateParams
    );
  }

  public savePassword() {
    this.vmSavePassword.activate(this.vm, { key: 'csui.vm.password', value: this.vm.password }).subscribe();
  }

}
