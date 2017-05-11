import { Injectable, EventEmitter } from '@angular/core';
import {
  MdlDialogReference,
  IMdlDialogConfiguration,
  IMdlCustomDialogConfiguration,
  MdlDialogService
} from 'angular2-mdl';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CustomAlertComponent, CustomAlertConfig } from './custom-alert.component';
import { CustomConfirmComponent, CustomConfirmConfig } from './custom-confirm.component';


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
  interpolateParams: { [key: string]: string; };
}

export interface DialogTranslationParams {
  message: string;
  translationTokens: Array<string>;
  interpolateParams: { [key: string]: string; };
}

type DialogType = 'ALERT' | 'CONFIRM';

const DialogTypes = {
  ALERT: 'ALERT' as DialogType,
  CONFIRM: 'CONFIRM' as DialogType
};

@Injectable()
export class DialogService {
  private static customDialogDefaultConfig = {
    isModal: true,
    clickOutsideToClose: true,
    enterTransitionDuration: 400,
    leaveTransitionDuration: 400
  };

  public onDialogsOpenChanged: EventEmitter<boolean>;

  constructor(
    private mdlDialogService: MdlDialogService,
    private translateService: TranslateService
  ) {
    this.onDialogsOpenChanged = this.mdlDialogService.onDialogsOpenChanged;
  }

  public showCustomDialog(config: IMdlCustomDialogConfiguration): Observable<MdlDialogReference> {
    return this.mdlDialogService.showCustomDialog(this.getMergedConfig(config));
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

  public customAlert(config: CustomAlertConfig): Observable<void> {
    return this.customAlertConfirm(DialogTypes.ALERT, config);
  }

  public customConfirm(config: CustomConfirmConfig): Observable<void> {
    return this.customAlertConfirm(DialogTypes.CONFIRM, config)
      .switchMap(result => result ? Observable.of(null) : Observable.throw);
  }

  public customAlertConfirm(
    dialogType: DialogType,
    config: CustomAlertConfig | CustomConfirmConfig
  ): Observable<void> {

    const dialogConfig = Object.assign(
      {
        component: dialogType === DialogTypes.ALERT ? CustomAlertComponent : CustomConfirmComponent,
        providers: [{ provide: 'config', useValue: config }]
      },
      config.width ? { width: config.width } : null,
      config.clickOutsideToClose ? { clickOutsideToClose: config.clickOutsideToClose } : null
    );

    return this.showCustomDialog(dialogConfig)
      .switchMap(res => res.onHide());
  }

  public showDialog(config: SimpleDialogConfiguration): Observable<MdlDialogReference> {
    const actionLabels = config.actions.map(action => action.text);
    const result = new Subject();
    const translationParams = this.getTranslationParams(config.message, actionLabels);

    this.translateService.get(translationParams.translationTokens, translationParams.interpolateParams)
      .subscribe(translations => {
        let newConfig = this.getMergedConfig(config);

        newConfig.message = translations[translationParams.message];
        newConfig.actions = newConfig.actions.map(action => ({
          handler: action.handler || (() => {}),
          text: translations[action.text] as string,
          isClosingAction: action.isClosingAction
        }));

        return this.mdlDialogService.showDialog(newConfig)
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
    const translationParams = this.getTranslationParams(args[0], Array.from(args).slice(1));

    this.translateService.get(translationParams.translationTokens, translationParams.interpolateParams)
      .switchMap(translations => {
        if (dialogType === DialogTypes.ALERT) {
          const params = this.getAlertParams(translations, args[0], args[1], args[2]);
          return this.mdlDialogService.alert.apply(this, params);
        } else {
          const params = this.getConfirmParams(translations, args[0], args[1], args[2], args[3]);
          return this.mdlDialogService.confirm.apply(this, params);
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

  private getTranslationParams(
    message: string | ParametrizedTranslation,
    strings: Array<string> = []
  ): DialogTranslationParams {
    const filteredStrings = strings.filter(str => str);
    if (typeof message === 'string') {
      return {
        message,
        translationTokens: [message].concat(filteredStrings),
        interpolateParams: {}
      };
    } else {
      return {
        message: message.translationToken,
        translationTokens: [message.translationToken].concat(filteredStrings),
        interpolateParams: message.interpolateParams
      };
    }
  }
}
