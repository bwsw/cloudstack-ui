import { ParametrizedTranslation } from '../../app/dialog/dialog-service/dialog.service';
import { MdSnackBarConfig } from '@angular/material';


export class MockNotificationService {
  public message(
    message: string | ParametrizedTranslation,
    config?: MdSnackBarConfig
  ): any {
    return;
  }

  public warning(
    message: string | ParametrizedTranslation,
    action: string,
    config?: MdSnackBarConfig
  ): any {
    return;
  }

  public error(
    message: string | ParametrizedTranslation,
    action?: string,
    config?: MdSnackBarConfig
  ): any {
    return;
  }
}
