import { Observable } from 'rxjs/Rx';
import { ConfirmDialogComponent, ConfirmDialogConfiguration } from './confirm-dialog/confirm-dialog.component';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Injectable } from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {} from '../dialog-module/dialog.service';

const defaultConfirmDialogConfirmText = 'YES';
const defaultConfirmDialogDeclineText = 'NO';

export interface ParametrizedTranslation {
    translationToken: string;
    interpolateParams: { [key: string]: string; };
}

export interface DialogTranslationParams {
    message: string;
    translationTokens: Array<string>;
    interpolateParams: { [key: string]: string; };
}

@Injectable()
export class DialogsService {

    constructor(private dialog: MdDialog) { }

    public confirm(config: ConfirmDialogConfiguration): Observable<void> {
        let dialogRef: MdDialogRef<ConfirmDialogComponent>;
        if (!config.confirmText) {
            config.confirmText = defaultConfirmDialogConfirmText;
        }
        if (!config.declineText) {
            config.declineText = defaultConfirmDialogDeclineText;
        }
        dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { config }
        });
        return dialogRef.afterClosed();
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

    private getConfirmParams(
      translations: object,
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

}