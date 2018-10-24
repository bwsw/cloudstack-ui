import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DynamicModule } from 'ng-dynamic-component';
import { ClipboardModule } from 'ngx-clipboard';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';

import { SshKeyEffects } from '../reducers/ssh-keys/redux/ssh-key.effects';
import { sshKeyReducers } from '../reducers/ssh-keys/redux/ssh-key.reducers';
import { ShhKeyFilterContainerComponent } from './containers/ssh-key-filter/ssh-key-filter.container';
import { SshKeyPageContainerComponent } from './containers/ssh-key-page/ssh-key-page.container';
// tslint:disable-next-line
import { SShKeyCreationDialogContainerComponent } from './ssh-key-creation/containers/ssh-key-creation-dialog.container';
import { SshKeyCreationDialogComponent } from './ssh-key-creation/ssh-key-creation-dialog.component';
import { SshKeyCreationComponent } from './ssh-key-creation/ssh-key-creation.component';
import { SshPrivateKeyDialogComponent } from './ssh-key-creation/ssh-private-key-dialog.component';
import { ShhKeyFilterComponent } from './ssh-key-filter/ssh-key-filter.component';
import { SshKeyFingerprintComponent } from './ssh-key-fingerprint/ssh-key-fingerprint.component';
import { SshKeyCardItemComponent } from './ssh-key-list-item/card-item/ssh-key-card-item.component';
import { SshKeyRowItemComponent } from './ssh-key-list-item/row-item/ssh-key-row-item.component';
import { SshKeyListComponent } from './ssh-key-list/ssh-key-list.component';
import { SshKeySidebarComponent } from './ssh-key-sidebar/ssh-key-sidebar.component';
import { SshKeysPageComponent } from './ssh-keys-page/ssh-keys-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ClipboardModule,
    RouterModule,
    DynamicModule.withComponents([SshKeyCardItemComponent, SshKeyRowItemComponent]),
    DraggableSelectModule,
    StoreModule.forFeature('sshKeys', sshKeyReducers),
    EffectsModule.forFeature([SshKeyEffects]),
  ],
  declarations: [
    SshKeyPageContainerComponent,
    ShhKeyFilterContainerComponent,
    SshKeyListComponent,
    SshKeyCardItemComponent,
    SshKeyRowItemComponent,
    SshKeysPageComponent,
    SShKeyCreationDialogContainerComponent,
    SshKeyCreationComponent,
    SshKeyCreationDialogComponent,
    SshPrivateKeyDialogComponent,
    SshKeySidebarComponent,
    SshKeyFingerprintComponent,
    ShhKeyFilterComponent,
  ],
  entryComponents: [SShKeyCreationDialogContainerComponent, SshPrivateKeyDialogComponent],
})
export class SshKeysModule {}
