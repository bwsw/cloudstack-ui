import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {DialogAction, ParametrizedTranslation} from '../../dialog-module/dialog.service';

export interface ConfirmDialogConfiguration {
    message: string | ParametrizedTranslation;
    confirmText?: string;
    declineText?: string;
    title?: string;
    clickOutsideToClose?: boolean;
}

@Component({
    selector: 'cs-confirm-dialog',
    templateUrl: 'confirm-dialog.component.html',
    styleUrls: ['confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    public config: ConfirmDialogConfiguration;

    constructor(
      public dialogRef: MdDialogRef<ConfirmDialogComponent>,
      @Inject(MD_DIALOG_DATA) data
    ) {
        this.config = data.config;
    }
}