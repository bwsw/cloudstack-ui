import { Component, HostListener, Inject } from '@angular/core';
import { ParametrizedTranslation } from './dialog.service';
import { MdlDialogReference } from 'angular2-mdl';


export interface CustomAlertConfig {
  message: string | ParametrizedTranslation;
  okText?: string;
  title?: string;
  width?: number;
  clickOutsideToClose?: boolean;
}

@Component({
  selector: 'cs-custom-alert'
})
export class CustomAlertComponent {
  constructor(
    public dialog: MdlDialogReference,
    @Inject('config') public config: CustomAlertConfig
  ) {}

  public ok(): void {
    this.dialog.hide();
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialog.hide();
  }
}
