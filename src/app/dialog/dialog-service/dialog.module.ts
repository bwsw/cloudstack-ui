import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatIconModule, MatExpansionModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AskDialogComponent } from './ask-dialog/ask-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DialogService } from './dialog.service';
import { SupportInformationComponent } from '../../shared/components/support-information/support-information.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    CommonModule,
    MatIconModule,
    MatExpansionModule
  ],
  exports: [
    ConfirmDialogComponent,
    AlertDialogComponent,
    AskDialogComponent
  ],
  declarations: [
    ConfirmDialogComponent,
    AlertDialogComponent,
    AskDialogComponent,
    SupportInformationComponent
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
