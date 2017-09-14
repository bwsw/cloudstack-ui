import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlModule } from '@angular-mdl/core';
import { MdTooltipModule, MdMenuModule, MdButtonModule, MdIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';

import { SshKeyListComponent } from './ssh-key-list/ssh-key-list.component';
import { SharedModule } from '../shared/shared.module';
import { SshKeysPageComponent } from './ssh-keys-page/ssh-keys-page.component';
import { SShKeyCreationDialogComponent } from './ssh-key-creation/ssh-key-creation-dialog.component';
import { SshPrivateKeyDialogComponent } from './ssh-key-creation/ssh-private-key-dialog.component';
import { SshKeyListItemComponent } from './ssh-key-list-item/ssh-key-list-item.component';
import { sshKeysRouting } from './ssh-keys.routing';
import { SshKeyCreationComponent } from './ssh-key-creation/ssh-key-creation.component';
import { SshKeySidebarComponent } from './ssh-key-sidebar/ssh-key-sidebar.component';
import { SshKeyFingerprintComponent } from './ssh-key-fingerprint/ssh-key-fingerprint.component';


@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    MdTooltipModule,
    MdlModule,
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    sshKeysRouting
  ],
  exports: [
    SshKeysPageComponent
  ],
  declarations: [
    SshKeyListComponent,
    SshKeyListItemComponent,
    SshKeysPageComponent,
    SShKeyCreationDialogComponent,
    SshKeyCreationComponent,
    SshPrivateKeyDialogComponent,
    SshKeySidebarComponent,
    SshKeyFingerprintComponent
  ],
  entryComponents: [
    SShKeyCreationDialogComponent,
    SshPrivateKeyDialogComponent
  ]
})
export class SshKeysModule { }
