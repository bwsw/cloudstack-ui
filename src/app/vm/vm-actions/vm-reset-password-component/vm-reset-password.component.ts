import {
  Component,
  Inject
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';
import { VirtualMachine } from '../../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';
import * as vmActions from '../../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-vm-reset-password',
  templateUrl: 'vm-reset-password.component.html',
  styleUrls: ['vm-reset-password.component.scss']
})
export class VmResetPasswordComponent {
  public message;
  public vm: VirtualMachine;
  public showSaveButton: boolean;
  public disableButton = false;

  constructor(
    public dialogRef: MatDialogRef<VmResetPasswordComponent>,
    private translateService: TranslateService,
    private userTagService: UserTagService,
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    this.disableButton = true;
    this.store.dispatch(new vmActions.SaveNewPassword({
      vm: this.vm,
      tag: {
        key: 'csui.vm.password',
        value: this.vm.password
      }
    }));
    this.showSaveButton = false;
  }

}
