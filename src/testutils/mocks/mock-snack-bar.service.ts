import { MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';

import { ParametrizedTranslation } from '../../app/dialog/dialog-service/dialog.service';

export class MockSnackBarService {
  public open(
    message: string | ParametrizedTranslation,
    action?: string,
    config?: MatSnackBarConfig,
  ): Observable<MatSnackBarRef<SimpleSnackBar>> {
    return of({} as MatSnackBarRef<SimpleSnackBar>);
  }
}
