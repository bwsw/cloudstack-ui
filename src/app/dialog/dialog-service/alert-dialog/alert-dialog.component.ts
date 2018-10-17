import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BaseDialogConfiguration } from '../dialog.service';

export interface AlertDialogConfiguration extends BaseDialogConfiguration {
  okText?: string;
}

@Component({
  selector: 'cs-alert-dialog',
  templateUrl: 'alert-dialog.component.html',
})
export class AlertDialogComponent {
  public config: AlertDialogConfiguration;

  constructor(
    public dialogRef: MatDialogRef<AlertDialogConfiguration>,
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

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialogRef.close();
  }
}
