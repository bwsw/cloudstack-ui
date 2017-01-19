import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { VM_PASSWORD_TOKEN } from './injector-token';
import { PasswordDialogModel } from './password-dialog.model';

@Component({
  selector: 'cs-password-dialog',
  templateUrl: './password-dialog.component.html'
})
export class PasswordDialogComponent {
  constructor(
    @Inject(VM_PASSWORD_TOKEN) private model: PasswordDialogModel,
    private dialog: MdlDialogReference
  ) {}

  public onOk(): void {
    this.dialog.hide();
  }
}
