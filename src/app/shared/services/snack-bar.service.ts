import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { ParametrizedTranslation } from '../../dialog/dialog-service/dialog.service';

export const MAX_NOTIFICATION_PARAM_LENGTH = 40;

@Injectable()
export class SnackBarService {
  public snackBarConfig: MatSnackBarConfig;

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    this.snackBarConfig = { duration: 2750 };
  }

  public open(
    message: string | ParametrizedTranslation,
    action?: string,
    config?: MatSnackBarConfig
  ) {
    this.getTranslatedMessage(message).subscribe(translatedMessage => {
      const _action = action ? action : null;
      const _config = config ? config : this.snackBarConfig;
      this.snackBar.open(translatedMessage, _action, _config);
    });
  }


  private getTranslatedMessage(message: string | ParametrizedTranslation): Observable<string> {
    if (typeof message === 'string') {
      return this.translateService.get(message);
    } else {
      return this.translateService.get(
        message.translationToken,
        message.interpolateParams
      );
    }
  }
}
