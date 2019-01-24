import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AskDialogComponent } from './ask-dialog/ask-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DialogService } from './dialog.service';
import { MaterialModule } from '../../material/material.module';
import { MatExpansionModule, MatIconModule } from '@angular/material';
import { SupportInformationComponent } from '../../support/support-information.component';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    MatIconModule,
    MatExpansionModule,
    HttpModule,
  ],
  exports: [ConfirmDialogComponent, AlertDialogComponent, AskDialogComponent],
  declarations: [
    ConfirmDialogComponent,
    AlertDialogComponent,
    AskDialogComponent,
    SupportInformationComponent,
  ],
  providers: [DialogService],
  entryComponents: [ConfirmDialogComponent, AlertDialogComponent, AskDialogComponent],
})
export class DialogModule {}
