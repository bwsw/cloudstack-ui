import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, first, tap } from 'rxjs/operators';

import { VirtualMachine } from '../vm.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { State, UserTagsActions, UserTagsSelectors } from '../../../root-store';
import { SaveVMPassword } from '../../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-vm-password',
  template: `
    <b>{{ 'VM_POST_ACTION.VM_PASSWORD' | translate }}:</b> {{ vm?.password }}
    <button
      mat-button
      color="primary"
      *ngIf="!saved"
      (click)="savePassword()"
    >{{ 'COMMON.SAVE' | translate }}
    </button>
    <div class="saved">
      <mat-icon
        *ngIf="saved"
        matTooltipPosition="below"
        [matTooltip]="'COMMON.SAVED' | translate"
        class="mdi-check-circle"
      >
      </mat-icon>
    </div>
  `,
  styles: [
    `
      .saved {
        display: inline-block;
        margin: 0 10px;
        vertical-align: middle;
      }
    `,
  ],
})
export class VmPasswordComponent implements OnInit {
  @Input()
  vm: VirtualMachine;
  public saved = false;
  private isAutoSave: boolean;

  constructor(private dialogService: DialogService, private store: Store<State>) {}

  public ngOnInit() {
    this.store
      .pipe(
        select(UserTagsSelectors.getIsSavePasswordForVMs),
        first(),
        tap(value => (this.isAutoSave = value)),
        filter(Boolean),
      )
      .subscribe(() => this.savePassword());
  }

  public savePassword() {
    this.store.dispatch(new SaveVMPassword({ vm: this.vm, password: this.vm.password }));
    this.saved = true;

    if (this.isAutoSave === null) {
      this.offerAutoSavePasswords();
    }
  }

  private offerAutoSavePasswords() {
    this.dialogService
      .confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_SAVE_PASSWORD' })
      .subscribe(res => {
        const value = !!res;
        this.store.dispatch(new UserTagsActions.SetSavePasswordForAllVMs({ value }));
      });
  }
}
