import { Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ParametrizedTranslation } from '../dialog-module/dialog.service';

export interface BaseDialogConfiguration {
  title?: string;
  message: string | ParametrizedTranslation;
  disableClose?: boolean;
  width?: string;
}


export class BaseDialogComponent<M> {

  public config: BaseDialogConfiguration;

  constructor(
    public dialogRef: MdDialogRef<M>,
    private translateService: TranslateService,
    @Inject(MD_DIALOG_DATA) data
  ) {
    this.config = data.config;
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