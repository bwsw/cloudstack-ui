import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlModule } from 'angular2-mdl';
import { TranslateModule } from 'ng2-translate';

import { SshKeyListComponent } from './ssh-key-list.component';
import { SharedModule } from '../shared/shared.module';
import { SshKeysPageComponent } from './ssh-keys-page.component';
import { SShKeyCreationDialogComponent } from './ssh-key-creation-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    MdlModule
  ],
  exports: [SshKeysPageComponent],
  declarations: [
    SshKeyListComponent,
    SshKeysPageComponent,
    SShKeyCreationDialogComponent
  ],
  entryComponents: [SShKeyCreationDialogComponent]
})
export class SshKeysModule { }
