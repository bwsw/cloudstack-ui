import { Injectable } from '@angular/core';
import {
  MdlDialogService,
  MdlDialogReference,
  IMdlCustomDialogConfiguration
} from 'angular2-mdl';
import { Observable } from 'rxjs';

@Injectable()
export class CustomDialogService extends MdlDialogService {
  private static defaultConfig = {
    isModal: true,
    clickOutsideToClose: true,
    enterTransitionDuration: 400,
    leaveTransitionDuration: 400
  };

  public showCustomDialog(config: IMdlCustomDialogConfiguration): Observable<MdlDialogReference> {
    const newConfig = Object.assign({}, CustomDialogService.defaultConfig, config);

    return super.showCustomDialog(newConfig);
  }
}
