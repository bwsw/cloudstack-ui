import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MaterialModule } from '../material/material.module';

import { SharedModule } from '../shared/shared.module';
import { VmLogsFilterContainerComponent } from './containers/vm-logs-filter.container';
import { VmLogsTableContainerComponent } from './containers/vm-logs-table.container';
import { VmLogsContainerComponent } from './containers/vm-logs.container';
import { BasePathPipe } from './pipes/base-path.pipe';
import { DateObjectToDatePipe } from './pipes/date-object-to-date.pipe';
import { vmLogFilesReducers } from './redux/vm-log-files.reducers';
import { reducer as vmLogsAutoUpdateReducers } from './redux/vm-logs-auto-update.reducers';
import { VmLogsEffects } from './redux/vm-logs.effects';
import { vmLogsReducers } from './redux/vm-logs.reducers';
import { VmLogFilesService } from './services/vm-log-files.service';
import { VmLogsService } from './services/vm-logs.service';
import { VmLogsEnabledGuard } from './vm-logs-enabled-guard.service';
import { VmLogsFilterComponent } from './vm-logs-filter/vm-logs-filter.component';
import { ScrollToLastDirective } from './vm-logs-table/scroll-to-last.directive';
import { VmLogsTableComponent } from './vm-logs-table/vm-logs-table.component';
import { VmLogsComponent } from './vm-logs/vm-logs.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    MatChipsModule,
    CdkTableModule,
    InfiniteScrollModule,
    StoreModule.forFeature('vmLogs', vmLogsReducers),
    StoreModule.forFeature('vmLogFiles', vmLogFilesReducers),
    StoreModule.forFeature('vmLogsAutoUpdate', vmLogsAutoUpdateReducers),
    EffectsModule.forFeature([VmLogsEffects]),
  ],
  declarations: [
    VmLogsComponent,
    VmLogsFilterComponent,
    VmLogsFilterContainerComponent,
    VmLogsTableComponent,
    VmLogsTableContainerComponent,
    BasePathPipe,
    DateObjectToDatePipe,
    VmLogsContainerComponent,
    ScrollToLastDirective,
  ],
  providers: [VmLogsService, VmLogFilesService, VmLogsEnabledGuard],
})
export class VmLogsModule {}
