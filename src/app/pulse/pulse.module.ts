import { MdlButtonModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdIconModule, MdSelectModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { ChartsModule } from 'ng2-charts';
import {
  PulseCpuRamChartComponent,
  PulseDiskChartComponent,
  PulseNetworkChartComponent,
} from './charts/';
import { AggregationSelectorComponent } from './charts/aggregation-selector.component';
import { ChartAreaComponent } from './charts/chart-area.component';
import { PulseService } from './pulse.service';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    MdlButtonModule,
    MdIconModule,
    MdSelectModule,
    TranslateModule
  ],
  exports: [
    PulseCpuRamChartComponent,
    PulseNetworkChartComponent,
    PulseDiskChartComponent
  ],
  providers: [PulseService],
  declarations: [
    AggregationSelectorComponent,
    ChartAreaComponent,
    PulseCpuRamChartComponent,
    PulseNetworkChartComponent,
    PulseDiskChartComponent
  ]
})
export class PulseModule {
}
