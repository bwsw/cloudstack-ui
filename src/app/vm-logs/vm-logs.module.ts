import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { ClipboardModule } from 'ngx-clipboard';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { VmLogsComponent } from './vm-logs/vm-logs.component';
import { VmLogsFilterComponent } from './vm-logs-filter/vm-logs-filter.component';
import { VmLogsService } from './services/vm-logs.service';
import { VmLogsEffects } from './redux/vm-logs.effects';
import { EffectsModule } from '@ngrx/effects';
import { VmLogsFilterContainerComponent } from './containers/vm-logs-filter.container';
import { StoreModule } from '@ngrx/store';
import { VmLogsTableComponent } from './vm-logs-table/vm-logs-table.component';
import { VmLogsTableContainerComponent } from './containers/vm-logs-table.container';
import { CdkTableModule } from '@angular/cdk/table';
import { BasePathPipe } from './pipes/base-path.pipe';
import { ParseTimestampPipe } from './pipes/parse-timestamp.pipe';
import { DateObjectToDatePipe } from './pipes/date-object-to-date.pipe';
import { VmLogFilesService } from './services/vm-log-files.service';
import { vmLogsReducers } from './redux/vm-logs.reducers';
import { vmLogFilesReducers } from './redux/vm-log-files.reducers';
import { reducer as vmLogsAutoUpdateReducers } from './redux/vm-logs-auto-update.reducers';
import { VmLogsContainerComponent } from './containers/vm-logs.container';
import { VmLogsEnabledGuard } from './vm-logs-enabled-guard.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollToLastDirective } from './vm-logs-table/scroll-to-last.directive';
import { VmLogsTokenService } from './services/vm-logs-token.service';
import { VmLogsTokenComponent } from './vm-logs-token/vm-logs-token.component';
import { InvalidateVmLogsTokenComponent } from './invalidate-vm-logs-token/invalidate-vm-logs-token.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    MatChipsModule,
    CdkTableModule,
    ClipboardModule,
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
    ParseTimestampPipe,
    DateObjectToDatePipe,
    VmLogsContainerComponent,
    ScrollToLastDirective,
    VmLogsTokenComponent,
    InvalidateVmLogsTokenComponent,
  ],
  providers: [VmLogsService, VmLogFilesService, VmLogsEnabledGuard, VmLogsTokenService],
  entryComponents: [VmLogsTokenComponent, InvalidateVmLogsTokenComponent],
})
export class VmLogsModule {}
