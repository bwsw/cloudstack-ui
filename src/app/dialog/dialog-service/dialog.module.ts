import { DialogService } from './dialog.service';
import { MdDialogModule, MdButtonModule  } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogComponent }   from './confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AskDialogComponent } from './ask-dialog/ask-dialog.component';

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
    AskDialogComponent
  ],
  declarations: [
    ConfirmDialogComponent,
    AlertDialogComponent,
    AskDialogComponent
  ],
  providers: [
    DialogService,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    AlertDialogComponent,
    AskDialogComponent
  ],
})
export class DialogModule { }
