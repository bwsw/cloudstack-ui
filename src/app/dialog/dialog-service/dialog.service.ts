import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

import { AlertDialogComponent, AlertDialogConfiguration } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogConfiguration } from './confirm-dialog/confirm-dialog.component';
import { AskDialogConfiguration, AskDialogComponent } from './ask-dialog/ask-dialog.component';
import { isUndefined } from 'util';

const defaultConfirmDialogConfirmText = 'YES';
const defaultConfirmDialogDeclineText = 'NO';
const defaultAlertDialogConfirmText = 'OK';
const defaultDisableClose = true;
const defaultWidth = '400px';

export interface ParametrizedTranslation {
  translationToken: string;
  interpolateParams: { [key: string]: string; };
}

export interface BaseDialogConfiguration {
  title?: string;
  message: string | ParametrizedTranslation;
  disableClose?: boolean;
  width?: string;
}


@Injectable()
export class DialogsService {

  constructor(private dialog: MdDialog) { }

  public confirm(config: ConfirmDialogConfiguration): Observable<void> {
    let dialogRef: MdDialogRef<ConfirmDialogComponent>;
    if (!config.confirmText) {
      config.confirmText = defaultConfirmDialogConfirmText;
    }
    if (!config.declineText) {
      config.declineText = defaultConfirmDialogDeclineText;
    }
    if (isUndefined(config.disableClose)) {
      config.disableClose = defaultDisableClose;
    }
    dialogRef = this.dialog.open(ConfirmDialogComponent, <MdDialogConfig>this.getDialogConfiguration(config));
    return dialogRef.afterClosed();
  }

  public alert(config: AlertDialogConfiguration): Observable<void> {
    let dialogRef: MdDialogRef<AlertDialogComponent>;
    if (!config.okText) {
      config.okText = defaultAlertDialogConfirmText;
    }

    if (isUndefined(config.disableClose)) {
      config.disableClose = defaultDisableClose;
    }
    dialogRef = this.dialog.open(AlertDialogComponent,  <MdDialogConfig>this.getDialogConfiguration(config));
    return dialogRef.afterClosed();
  }

  public askDialog(config: AskDialogConfiguration): Observable<void> {
    let dialogRef: MdDialogRef<AskDialogComponent>;
    if (isUndefined(config.disableClose)) {
      config.disableClose = defaultDisableClose;
    }
    config.actions = config.actions.map(action => ({
      handler: action.handler || (() => {}),
      text: action.text,
      isClosingAction: action.isClosingAction
    }));

    dialogRef = this.dialog.open(AskDialogComponent, <MdDialogConfig>this.getDialogConfiguration(config));
    return dialogRef.afterClosed();
  }

  private getDialogConfiguration(config: BaseDialogConfiguration) {
    return config.width ?
      {
        data: { config },
        disableClose: config.disableClose,
        width: config.width,
      } :
      {
        data: { config },
        disableClose: config.disableClose,
        width: defaultWidth
      };
  }
}