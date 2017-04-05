import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { TranslateModule } from 'ng2-translate';
import { ClipboardModule } from 'ngx-clipboard/dist';

import { SshKeyListComponent } from './ssh-key-list.component';
import { SharedModule } from '../shared/shared.module';
import { SshKeysPageComponent } from './ssh-keys-page.component';
import { SShKeyCreationDialogComponent } from './ssh-key-creation/ssh-key-creation-dialog.component';
import { SshPrivateKeyDialogComponent } from './ssh-key-creation/ssh-private-key-dialog.component';
import { SshKeyListItemComponent } from './ssh-key-list-item.component';


@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule
  ],
  exports: [SshKeysPageComponent],
  declarations: [
    SshKeyListComponent,
    SshKeyListItemComponent,
    SshKeysPageComponent,
    SShKeyCreationDialogComponent,
    SshPrivateKeyDialogComponent
  ],
  entryComponents: [
    SShKeyCreationDialogComponent,
    SshPrivateKeyDialogComponent
  ]
})
export class SshKeysModule { }
