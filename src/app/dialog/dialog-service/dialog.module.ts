import { DialogsService } from './dialog.service';
import { MdDialogModule, MdButtonModule  } from '@angular/material';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogComponent }   from './confirm-dialog/confirm-dialog.component';

@NgModule({
    imports: [
        MdDialogModule,
        MdButtonModule,
        TranslateModule
    ],
    exports: [
        ConfirmDialogComponent,
    ],
    declarations: [
        ConfirmDialogComponent,
    ],
    providers: [
        DialogsService,
    ],
    entryComponents: [
        ConfirmDialogComponent,
    ],
})
export class DialogModule { }