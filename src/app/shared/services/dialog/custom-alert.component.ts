import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { CustomSimpleComponent, CustomSimpleDialogConfig } from './custom-simple-dialog.component';


export interface CustomAlertConfig extends CustomSimpleDialogConfig {
  okText?: string;
}

@Component({
  selector: 'cs-custom-alert',
  templateUrl: 'custom-alert.component.html',
  styleUrls: ['custom-simple-dialog.scss']
})
export class CustomAlertComponent extends CustomSimpleComponent {
  constructor(
    @Inject('config') public config: CustomAlertConfig,
    protected dialog: MdlDialogReference,
  ) {
    super(config, dialog);
  }

  public ok(): void {
    this.dialog.hide();
  }
}
