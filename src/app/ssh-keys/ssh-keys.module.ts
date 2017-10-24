import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { SharedModule } from '../shared/shared.module';
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
import { SshKeyListContainerComponent } from './containers/ssh-key-list.container';
import { StoreModule } from '@ngrx/store';
import { sshKeyReducers } from './redux/ssh-key.reducers';
import { EffectsModule } from '@ngrx/effects';
import { SshKeyEffects } from './redux/ssh-key.effects';
import { SShKeyCreationDialogContainerComponent } from './ssh-key-creation/containers/ssh-key-creation-dialog.container';
import { SshKeyCreationDialogComponent } from './ssh-key-creation/ssh-key-creation-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    MatTooltipModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    DynamicModule.withComponents([SshKeyListItemComponent]),
    DraggableSelectModule,
    StoreModule.forFeature('sshKeys', sshKeyReducers),
    EffectsModule.forFeature([SshKeyEffects]),
  ],
  declarations: [
    SshKeyListContainerComponent,
    SshKeyListComponent,
    SshKeyListItemComponent,
    SshKeysPageComponent,
    SShKeyCreationDialogContainerComponent,
    SshKeyCreationComponent,
    SshKeyCreationDialogComponent,
    SshPrivateKeyDialogComponent,
    SshKeySidebarComponent,
    SshKeyFingerprintComponent,
    ShhKeyFilterComponent
  ],
  entryComponents: [
    SShKeyCreationDialogContainerComponent,
    SshPrivateKeyDialogComponent
  ]
})
export class SshKeysModule {
}
