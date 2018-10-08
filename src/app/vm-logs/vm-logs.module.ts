import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { LogFilesComponent } from './log-files.component';
import { LogFilesFilterComponent } from './log-files-filter.component';
import { LogFileListComponent } from './log-file-list.component';
import { LogsComponent } from './logs.component';
import { LogsFilterComponent } from './logs-filter.component';
import { ChipsAutocompleteExampleComponent, LogTagsComponent } from './log-tags.component';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    MatChipsModule,
    // StoreModule.forFeature('vmLogs', vmLogsReducers),
    // EffectsModule.forFeature([VmLogsEffects]),
  ],
  declarations: [
    LogFilesComponent,
    LogFilesFilterComponent,
    LogFileListComponent,
    LogsComponent,
    LogsFilterComponent,
    LogTagsComponent
  ],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ]
})
export class VmLogsModule {
}
