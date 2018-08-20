import { MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { ParametrizedTranslation } from '../../app/dialog/dialog-service/dialog.service';


export class MockSnackBarService {
  public open(
    message: string | ParametrizedTranslation,
    action?: string,
    config?: MatSnackBarConfig
  ): Observable<MatSnackBarRef<SimpleSnackBar>> {
    return Observable.of({} as MatSnackBarRef<SimpleSnackBar>)
  }
}
