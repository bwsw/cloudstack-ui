import { DialogsService } from './dialog.service';
import { MdDialogModule, MdButtonModule  } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogComponent }   from './confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AskDialogComponent } from './ask-dialog/ask-dialog.component';
import { BaseDialogComponent } from './base-dialog.component';

@NgModule({
  imports: [
    MdDialogModule,
    MdButtonModule,
    TranslateModule,
    CommonModule
  ],
  exports: [
    ConfirmDialogComponent,
    AlertDialogComponent,
    AskDialogComponent,
    BaseDialogComponent
  ],
  declarations: [
    ConfirmDialogComponent,
    AlertDialogComponent,
    AskDialogComponent,
    BaseDialogComponent
  ],
  providers: [
    DialogsService,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    AlertDialogComponent,
    AskDialogComponent,
    BaseDialogComponent
  ],
})
export class DialogModule { }