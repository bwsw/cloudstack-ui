import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { ChartsModule } from 'ng2-charts';
import {
  PulseCpuChartComponent,
  PulseDiskChartComponent,
  PulseNetworkChartComponent,
  PulseRamChartComponent
} from './charts/';
import { AggregationSelectorComponent } from './charts/aggregation-selector.component';
import { ChartAreaComponent } from './charts/chart-area.component';
import { PulseService } from './pulse.service';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    MdSelectModule,
    TranslateModule
  ],
  exports: [
    PulseCpuChartComponent,
    PulseRamChartComponent,
    PulseNetworkChartComponent,
    PulseDiskChartComponent
  ],
  providers: [PulseService],
  declarations: [
    AggregationSelectorComponent,
    ChartAreaComponent,
    PulseCpuChartComponent,
    PulseRamChartComponent,
    PulseNetworkChartComponent,
    PulseDiskChartComponent
  ]
})
export class PulseModule {
}
