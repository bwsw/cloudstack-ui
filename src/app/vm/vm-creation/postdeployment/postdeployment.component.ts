import {
  Component,
  Input
} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  getLogin,
  getPassword,
  isHttpAuthMode,
  VirtualMachine,
  VmState
} from '../../shared/vm.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { State } from '../../../reducers/vm/redux/vm.reducers';
import { TagService } from '../../../shared/services/tags/tag.service';
import { VirtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';
import { WebShellService } from '../../web-shell/web-shell.service';
import { VmCreationComponent } from '../vm-creation.component';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';
import * as vmActions from '../../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-postdeployment-dialog',
  templateUrl: 'postdeployment.component.html',
  styleUrls: ['postdeployment.component.scss']
})
export class PostdeploymentComponent {
  @Input() public vm: VirtualMachine;
  @Input() public dialogRef: MatDialogRef<VmCreationComponent>;
  @Input() public title: string;

  public canSavePassword: boolean;
  public disableButton = false;

  public actions: any[] = [
    {
      name: 'VM_POST_ACTION.OPEN_VNC_CONSOLE',
      hidden: (vm) => !vm || vm.state !== VmState.Running,
      activate: (vm) => this.store.dispatch(new vmActions.ConsoleVm(vm))
    },
    {
      name: 'VM_POST_ACTION.OPEN_SHELL_CONSOLE',
      hidden: (vm) => {
        return !vm
          || !this.webShellService.isWebShellEnabled
          || !WebShellService.isWebShellEnabledForVm(vm);
      },
      activate: (vm) => this.store.dispatch(new vmActions.WebShellVm(vm))
    },
    {
      name: 'VM_POST_ACTION.OPEN_URL',
      hidden: (vm) => !vm || !isHttpAuthMode(vm),
      activate: (vm) => this.store.dispatch(new vmActions.OpenUrlVm(vm))
    }
  ];


  constructor(
    private store: Store<State>,
    private webShellService: WebShellService,
    private dialogService: DialogService,
    private tagService: TagService,
    private userTagService: UserTagService
  ) {
    this.userTagService.getSavePasswordForAllVms().subscribe(tag => {
      this.canSavePassword = !tag;
    });
  }

  public getPassword() {
    const pass = this.vm.tags.find(tag => tag.key === VirtualMachineTagKeys.passwordTag);
    return this.vm.password || pass && pass.value;
  }

  public isHttpAuthMode(vm): boolean {
    return isHttpAuthMode(vm);
  }

  public getUrlLogin(vm) {
    return getLogin(vm);
  }

  public getUrlPassword(vm) {
    return getPassword(vm);
  }

  public savePassword() {
    this.disableButton = true;
    this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_SAVE_PASSWORD' })
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          return this.userTagService.setSavePasswordForAllVms(true);
        }
        return Observable.of(null);
      })
      .switchMap(() =>
        this.tagService.update(
          this.vm,
          this.vm.resourceType,
          VirtualMachineTagKeys.passwordTag,
          this.vm.password
        )
      ).subscribe(() => {
      this.canSavePassword = false;
    });
  }
}
