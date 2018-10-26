import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import {
  AlertDialogComponent,
  AlertDialogConfiguration,
} from './alert-dialog/alert-dialog.component';
import { AskDialogComponent, AskDialogConfiguration } from './ask-dialog/ask-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogConfiguration,
} from './confirm-dialog/confirm-dialog.component';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';

const defaultConfirmDialogConfirmText = 'COMMON.YES';
const defaultConfirmDialogDeclineText = 'COMMON.NO';
const defaultAlertDialogConfirmText = 'COMMON.OK';
const defaultDisableClose = true;
const defaultWidth = '400px';

export interface ParametrizedTranslation {
  translationToken: string;
  interpolateParams: { [key: string]: string };
}

export interface BaseDialogConfiguration {
  title?: string;
  message: string | ParametrizedTranslation;
  disableClose?: boolean;
  width?: string;
}

@Injectable()
export class DialogService {
  constructor(
    private dialog: MatDialog,
    private jobsNotificationService: JobsNotificationService,
  ) {}

  public confirm(config: ConfirmDialogConfiguration): Observable<any> {
    let dialogRef: MatDialogRef<ConfirmDialogComponent>;
    if (!config.confirmText) {
      config.confirmText = defaultConfirmDialogConfirmText;
    }
    if (!config.declineText) {
      config.declineText = defaultConfirmDialogDeclineText;
    }
    if (config.disableClose === undefined) {
      config.disableClose = defaultDisableClose;
    }
    dialogRef = this.dialog.open(ConfirmDialogComponent, this.getDialogConfiguration(config));
    return dialogRef.afterClosed();
  }

  public alert(config: AlertDialogConfiguration): Observable<void> {
    let dialogRef: MatDialogRef<AlertDialogComponent>;
    if (!config.okText) {
      config.okText = defaultAlertDialogConfirmText;
    }

    if (config.disableClose === undefined) {
      config.disableClose = defaultDisableClose;
    }
    dialogRef = this.dialog.open(AlertDialogComponent, this.getDialogConfiguration(config));
    return dialogRef.afterClosed();
  }

  public askDialog(config: AskDialogConfiguration): Observable<void> {
    let dialogRef: MatDialogRef<AskDialogComponent>;
    if (config.disableClose === undefined) {
      config.disableClose = defaultDisableClose;
    }
    config.actions = config.actions.map(action => ({
      handler: action.handler || (() => {}),
      text: action.text,
      isClosingAction: action.isClosingAction,
    }));

    dialogRef = this.dialog.open(AskDialogComponent, this.getDialogConfiguration(config));
    return dialogRef.afterClosed();
  }

  public showNotificationsOnFail(error, message?: string, jobNotificationId?: string): void {
    if (jobNotificationId) {
      this.jobsNotificationService.fail({
        message,
        id: jobNotificationId,
      });
    }

    this.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params,
      },
    });
  }

  private getDialogConfiguration(config: BaseDialogConfiguration) {
    const configuration = {
      data: { config },
      disableClose: config.disableClose,
    } as MatDialogConfig;
    return config.width
      ? { ...configuration, width: config.width }
      : { ...configuration, width: defaultWidth };
  }
}
