import { ParametrizedTranslation } from '../../app/dialog/dialog-service/dialog.service';
import { MatSnackBarConfig } from '@angular/material';


export class MockSnackBarService {
  public open(
    message: string | ParametrizedTranslation,
    action?: string,
    config?: MatSnackBarConfig
  ): void {
  }
}
