import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdMenuModule,
  MdSelectModule,
  MdTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { SharedModule } from '../shared/shared.module';
import { SShKeyCreationDialogComponent } from './ssh-key-creation/ssh-key-creation-dialog.component';
import { SshKeyCreationComponent } from './ssh-key-creation/ssh-key-creation.component';
import { SshPrivateKeyDialogComponent } from './ssh-key-creation/ssh-private-key-dialog.component';
import { SshKeyFingerprintComponent } from './ssh-key-fingerprint/ssh-key-fingerprint.component';
import { SshKeyListItemComponent } from './ssh-key-list-item/ssh-key-list-item.component';
import { SshKeySidebarComponent } from './ssh-key-sidebar/ssh-key-sidebar.component';
import { SshKeysPageComponent } from './ssh-keys-page/ssh-keys-page.component';
import { SshKeyListComponent } from './ssh-key-list/ssh-key-list.component';
import { ShhKeyFilterComponent } from './ssh-key-filter/ssh-key-filter.component';
import { DynamicModule } from 'ng-dynamic-component';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';


@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    MdTooltipModule,
    MdSelectModule,
    MdDialogModule,
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    DynamicModule.withComponents([SshKeyListItemComponent]),
    DraggableSelectModule
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
    SshKeyFingerprintComponent,
    ShhKeyFilterComponent
  ],
  entryComponents: [
    SShKeyCreationDialogComponent,
    SshPrivateKeyDialogComponent
  ]
})
export class SshKeysModule { }
