import { MdlModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdDialogModule,
  MdIconModule,
  MdMenuModule,
  MdTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { SharedModule } from '../shared/shared.module';
import { SShKeyCreationDialogComponent } from './ssh-key-creation/ssh-key-creation-dialog.component';
import { SshKeyCreationComponent } from './ssh-key-creation/ssh-key-creation.component';
import { SshPrivateKeyDialogComponent } from './ssh-key-creation/ssh-private-key-dialog.component';
import { SshKeyListItemComponent } from './ssh-key-list-item.component';

import { SshKeyListComponent } from './ssh-key-list.component';
import { SshKeysPageComponent } from './ssh-keys-page.component';
import { sshKeysRouting } from './ssh-keys.routing';


@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    MdTooltipModule,
    MdDialogModule,
    MdlModule,
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    sshKeysRouting
  ],
  exports: [SshKeysPageComponent],
  declarations: [
    SshKeyListComponent,
    SshKeyListItemComponent,
    SshKeysPageComponent,
    SShKeyCreationDialogComponent,
    SshKeyCreationComponent,
    SshPrivateKeyDialogComponent
  ],
  entryComponents: [
    SShKeyCreationDialogComponent,
    SshPrivateKeyDialogComponent
  ]
})
export class SshKeysModule { }
