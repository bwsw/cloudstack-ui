import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { ParametrizedTranslation } from '../../dialog/dialog-service/dialog.service';

@Injectable()
export class SnackBarService {
  private readonly snackBarConfig: MatSnackBarConfig;

  constructor(private snackBar: MatSnackBar, private translateService: TranslateService) {
    this.snackBarConfig = { duration: 2750 };
  }

  public open(
    message: string | ParametrizedTranslation,
    action?: string,
    config?: MatSnackBarConfig,
  ): Observable<MatSnackBarRef<SimpleSnackBar>> {
    const message$ = this.getTranslatedString(message);
    const action$ = action ? this.getTranslatedString(action) : of(null);
    const conf = config ? config : this.snackBarConfig;

    return zip(message$, action$).pipe(
      map(([translatedMessage, translatedAction]) =>
        this.snackBar.open(translatedMessage, translatedAction, conf),
      ),
    );
  }

  private getTranslatedString(message: string | ParametrizedTranslation): Observable<string> {
    if (typeof message === 'string') {
      return this.translateService.get(message);
    }
    return this.translateService.get(message.translationToken, message.interpolateParams);
  }
}
