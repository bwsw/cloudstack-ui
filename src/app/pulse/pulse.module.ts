import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import {
  PulseCpuRamChartComponent,
  PulseDiskChartComponent,
  PulseNetworkChartComponent,
} from './charts/';
import { AggregationSelectorComponent } from './charts/aggregation-selector.component';
import { ChartAreaComponent } from './charts/chart-area.component';
import { PulseService } from './pulse.service';
import { VmPulseComponent } from './vm-pulse/vm-pulse.component';
import { BaseChartDirective } from './charts/chart.directive';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  exports: [
    BaseChartDirective,
    VmPulseComponent
  ],
  providers: [PulseService],
  declarations: [
    BaseChartDirective,
    AggregationSelectorComponent,
    ChartAreaComponent,
    PulseCpuRamChartComponent,
    PulseNetworkChartComponent,
    PulseDiskChartComponent,
    VmPulseComponent
  ],
  entryComponents: [VmPulseComponent]
})
export class PulseModule {
}
