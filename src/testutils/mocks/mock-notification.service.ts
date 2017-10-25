import { ParametrizedTranslation } from '../../app/dialog/dialog-service/dialog.service';
import { MatSnackBarConfig } from '@angular/material';


export class MockNotificationService {
  public message(
    message: string | ParametrizedTranslation,
    config?: MatSnackBarConfig
  ): any {
    return;
  }

  public warning(
    message: string | ParametrizedTranslation,
    action: string,
    config?: MatSnackBarConfig
  ): any {
    return;
  }

  public error(
    message: string | ParametrizedTranslation,
    action?: string,
    config?: MatSnackBarConfig
  ): any {
    return;
  }
}
