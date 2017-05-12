import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { CustomSimpleComponent, CustomSimpleDialogConfig } from './custom-simple-dialog.component';


export interface CustomConfirmConfig extends CustomSimpleDialogConfig {
  declineText?: string;
  confirmText?: string;
}

@Component({
  selector: 'cs-custom-confirm',
  templateUrl: 'custom-confirm.component.html',
  styleUrls: ['custom-simple-dialog.scss']
})
export class CustomConfirmComponent extends CustomSimpleComponent {
  constructor(
    @Inject('config') public config: CustomConfirmConfig,
    protected dialog: MdlDialogReference
  ) {
    super(config, dialog);
  }

  public confirm(): void {
    this.dialog.hide(true);
  }

  public decline(): void {
    this.dialog.hide(false);
  }
}
