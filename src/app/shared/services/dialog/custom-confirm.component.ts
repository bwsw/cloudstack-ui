import { Component, Inject } from '@angular/core';
import { ParametrizedTranslation } from './dialog.service';
import { MdlDialogReference } from 'angular2-mdl';


export interface CustomConfirmConfig {
  message: string | ParametrizedTranslation;
  declineText?: string;
  confirmText?: string;
  title?: string;
  width?: number;
  clickOutsideToClose?: boolean;
}

@Component({
  selector: 'cs-custom-confirm'
})
export class CustomConfirmComponent {
  constructor(
    public dialog: MdlDialogReference,
    @Inject('config') public config: CustomConfirmConfig
  ) {}

  public confirm(): void {
    this.dialog.hide(true);
  }

  public decline(): void {
    this.dialog.hide(false);
  }
}
