import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdProgressSpinnerModule,
  MdSelectModule,
  MdTabsModule,
  MdTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { ChartsModule } from 'ng2-charts/src/charts/charts';
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

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ChartsModule,
    FormsModule,
    MdButtonModule,
    MdIconModule,
    MdTooltipModule,
    MdDialogModule,
    MdInputModule,
    MdTabsModule,
    MdSelectModule,
    MdProgressSpinnerModule,
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
