import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BaseDialogConfiguration } from '../dialog.service';

export interface AskDialogConfiguration extends BaseDialogConfiguration {
  actions: DialogAction[];
}

export interface DialogAction {
  handler?: () => void;
  text: string;
  isClosingAction?: boolean;
}

@Component({
  selector: 'cs-ask-dialog',
  templateUrl: 'ask-dialog.component.html',
  styleUrls: ['ask-dialog.component.scss'],
})
export class AskDialogComponent {
  public config: AskDialogConfiguration;

  constructor(
    public dialogRef: MatDialogRef<AskDialogConfiguration>,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.config = data.config;
  }

  public get translatedMessage(): Observable<string> {
    if (typeof this.config.message === 'string') {
      return this.translateService.get(this.config.message);
    }
    return this.translateService.get(
      this.config.message.translationToken,
      this.config.message.interpolateParams,
    );
  }

  public actionClicked(action: DialogAction): void {
    action.handler();
    this.dialogRef.close();
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    const closeAction = this.config.actions.find(action => action.isClosingAction);
    if (closeAction) {
      closeAction.handler();
      this.dialogRef.close();
    }
  }
}
