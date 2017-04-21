import { Injectable } from '@angular/core';
import {
  MdlDialogReference,
  IMdlDialogConfiguration,
  IMdlCustomDialogConfiguration,
  MdlDialogService
} from 'angular2-mdl';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate';
import { ServiceLocator } from './service-locator';
import { Subject } from 'rxjs';


export interface SimpleDialogConfiguration extends IMdlDialogConfiguration {
  title?: string;
  message: string | ParametrizedTranslation;
  actions: Array<DialogAction>;
  fullWidthAction?: boolean;
}

export interface DialogAction {
  handler?: () => void;
  text: string;
  isClosingAction?: boolean;
}

export interface ParametrizedTranslation {
  translationToken: string;
  interpolateParams: {
    [key: string]: string;
  };
}

type DialogType = 'ALERT' | 'CONFIRM';

const DialogTypes = {
  ALERT: 'ALERT' as DialogType,
  CONFIRM: 'CONFIRM' as DialogType
};

@Injectable()
export class DialogService extends MdlDialogService {
  private static customDialogDefaultConfig = {
    isModal: true,
    clickOutsideToClose: true,
    enterTransitionDuration: 400,
    leaveTransitionDuration: 400
  };

  private get translateService(): TranslateService {
    return ServiceLocator.injector.get(TranslateService);
  }

  public showCustomDialog(config: IMdlCustomDialogConfiguration): Observable<MdlDialogReference> {
    return super.showCustomDialog(this.getMergedConfig(config));
  }

  public alert(message: string | ParametrizedTranslation, okText?: string, title?: string): Observable<void> {
    return this.alertConfirmDialog(DialogTypes.ALERT, message, okText, title);
  }

  public confirm(
    message: string | ParametrizedTranslation,
    declineText?: string,
    confirmText?: string,
    title?: string
  ): Observable<void> {
    return this.alertConfirmDialog(DialogTypes.CONFIRM, message, declineText, confirmText, title);
  }

  public showDialog(config: SimpleDialogConfiguration): Observable<MdlDialogReference> {
    const actionLabels = config.actions.map(action => action.text);
    const result = new Subject();
    let translateToken = typeof config.message === 'string' ? config.message : config.message.translationToken;
    let interpolateParams = typeof config.message === 'string' ? undefined : config.message.interpolateParams;

    (typeof config.message === 'string' ?
      this.translateService.get(actionLabels.concat(translateToken)) :
      this.translateService.get(actionLabels.concat(translateToken), interpolateParams)
    )
      .subscribe(translations => {
        let newConfig = this.getMergedConfig(config);

        newConfig.message = translations[translateToken];
        newConfig.actions = newConfig.actions.map(action => ({
          handler: action.handler || (() => {}),
          text: translations[action.text] as string,
          isClosingAction: action.isClosingAction
        }));

        return super.showDialog(newConfig)
          .subscribe(
            () => {
              result.next(null);
              result.complete();
            },
            () => result.error(null)
          );
      });

    return Observable.of(null);
  }

  private alertConfirmDialog(dialogType: DialogType, ...args: Array<any>): Observable<void> {
    const result: Subject<any> = new Subject();
    const dialogParams = Array.from(args).filter(param => param);
    const message = args[0];

    let dialogObservable;
    if (typeof message === 'string') {
      dialogObservable = this.translateService.get(dialogParams);
    } else {
      dialogObservable = this.translateService.get(
        [message.translationToken].concat(dialogParams.slice(1)),
        message.interpolateParams
      );
    }

    dialogObservable.switchMap(translations => {
      if (dialogType === DialogTypes.ALERT) {
        const params = this.getAlertParams(translations, args[0], args[1], args[2]);
        return super.alert.apply(this, params);
      } else {
        const params = this.getConfirmParams(translations, args[0], args[1], args[2], args[3]);
        return super.confirm.apply(this, params);
      }
    })
      .subscribe(
        () => {
          result.next(null);
          result.complete();
        },
        () => result.error(null)
      );

    return result;
  }

  private getAlertParams(translations, message, okText?, title?): Array<string> {
    const extractedMessage = typeof message === 'string' ? message : message.translationToken;
    return [translations[extractedMessage], translations[okText], translations[title]];
  }

  private getConfirmParams(
    translations: Object,
    message: string | ParametrizedTranslation,
    declineText?: string,
    confirmText?: string,
    title?: string
  ): Array<string> {
    const extractedMessage = typeof message === 'string' ? message : message.translationToken;
    return [
      translations[extractedMessage],
      translations[declineText],
      translations[confirmText],
      translations[title]
    ];
  }

  private getMergedConfig(config: IMdlDialogConfiguration): any {
    return Object.assign({}, DialogService.customDialogDefaultConfig, config);
  }
}
