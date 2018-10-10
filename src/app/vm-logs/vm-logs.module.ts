import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { VmLogsComponent } from './vm-logs/vm-logs.component';
import { VmLogsFilterComponent } from './vm-logs-filter/vm-logs-filter.component';
import { VmLogsService } from './services/vm-logs.service';
import { VmLogKeywordsComponent } from './vm-log-keywords/vm-log-keywords.component';
import { VmLogsEffects } from './redux/vm-logs.effects';
import { EffectsModule } from '@ngrx/effects';
import { VmLogsFilterContainerComponent } from './containers/vm-logs-filter.container';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    MatChipsModule,
    // StoreModule.forFeature('vmLogs', vmLogsReducers),
    EffectsModule.forFeature([VmLogsEffects]),
  ],
  declarations: [
    VmLogsComponent,
    VmLogsFilterComponent,
    VmLogsFilterContainerComponent,
    VmLogKeywordsComponent
  ],
  providers: [
    VmLogsService
  ]
})
export class VmLogsModule {
}
