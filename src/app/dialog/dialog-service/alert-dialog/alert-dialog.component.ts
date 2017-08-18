import { Component, HostListener } from '@angular/core';
import { BaseDialogComponent, BaseDialogConfiguration } from '../base-dialog.component';

export interface AlertDialogConfiguration extends BaseDialogConfiguration{
  okText?: string;
  title?: string;
}

@Component({
  selector: 'cs-alert-dialog',
  templateUrl: 'alert-dialog.component.html'
})
export class AlertDialogComponent extends BaseDialogComponent<AlertDialogComponent> {

  public config: AlertDialogConfiguration;


  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialogRef.close();
  }
}