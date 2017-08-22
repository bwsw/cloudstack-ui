import { Component, HostListener, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BaseDialogConfiguration } from '../dialog.service';

export interface ConfirmDialogConfiguration extends BaseDialogConfiguration {
  confirmText?: string;
  declineText?: string;
}

@Component({
    selector: 'cs-confirm-dialog',
    templateUrl: 'confirm-dialog.component.html'
})
export class ConfirmDialogComponent{

  public config: ConfirmDialogConfiguration;

  constructor(
    public dialogRef: MdDialogRef<ConfirmDialogConfiguration>,
    private translateService: TranslateService,
    @Inject(MD_DIALOG_DATA) data
  ) {
    this.config = data.config;
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialogRef.close();
  }
  public get translatedMessage(): Observable<string> {
    if (typeof this.config.message === 'string') {
      return this.translateService.get(this.config.message);
    } else {
      return this.translateService.get(
        this.config.message.translationToken,
        this.config.message.interpolateParams
      );
    }
  }
}