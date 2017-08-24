import { Observable } from 'rxjs/Observable';
import { ParametrizedTranslation, SimpleDialogConfiguration } from '../../app/dialog/dialog-module/dialog.service';
import { CustomSimpleDialogConfig } from '../../app/dialog/dialog-module/custom-dialog.component';
import { IMdlCustomDialogConfiguration } from '../../app/dialog/dialog-module/mdl-dialog-configuration';
import { MdlDialogReference } from '../../app/dialog/dialog-module/mdl-dialog.service';


export class MockDialogService {
  public showCustomDialog(config: IMdlCustomDialogConfiguration): Observable<MdlDialogReference> {
    return Observable.of(null);
  }

  public alert(message: string | ParametrizedTranslation, okText?: string, title?: string): Observable<void> {
    return Observable.of(null);
  }

  public confirm(
    message: string | ParametrizedTranslation,
    declineText?: string,
    confirmText?: string,
    title?: string
  ): Observable<void> {
    return Observable.of(null);
  }

  public customAlert(config: CustomSimpleDialogConfig): Observable<void> {
    return Observable.of(null);
  }

  public customConfirm(config: CustomSimpleDialogConfig): Observable<void> {
    return Observable.of(null);
  }

  public showDialog(config: SimpleDialogConfiguration): Observable<MdlDialogReference> {
    return Observable.of(null);
  }
}
