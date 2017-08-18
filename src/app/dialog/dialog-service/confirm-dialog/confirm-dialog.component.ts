import { Component, HostListener } from '@angular/core';
import { BaseDialogComponent, BaseDialogConfiguration } from '../base-dialog.component';

export interface ConfirmDialogConfiguration extends BaseDialogConfiguration{
    confirmText?: string;
    declineText?: string;
}

@Component({
    selector: 'cs-confirm-dialog',
    templateUrl: 'confirm-dialog.component.html'
})
export class ConfirmDialogComponent extends BaseDialogComponent<ConfirmDialogComponent> {

  public config: ConfirmDialogConfiguration;

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialogRef.close();
  }
}