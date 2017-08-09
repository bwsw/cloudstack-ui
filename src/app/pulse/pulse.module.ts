import { MdlButtonModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdSelectModule,
  MdTabsModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { ChartsModule } from 'ng2-charts/src/charts/charts';
import {
  PulseCpuRamChartComponent,
  PulseDiskChartComponent,
  PulseNetworkChartComponent,
} from './charts/';
import { AggregationSelectorComponent } from './charts/aggregation-selector.component';
import { ChartAreaComponent } from './charts/chart-area.component';
import { PulseService } from './pulse.service';
import { VmPulseComponent } from './vm-pulse/vm-pulse.component';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    MdlButtonModule,
    MdIconModule,
    MdDialogModule,
    MdInputModule,
    MdTabsModule,
    MdSelectModule,
    TranslateModule
  ],
  exports: [
    VmPulseComponent
  ],
  providers: [PulseService],
  declarations: [
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
