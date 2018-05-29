import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { PulseCpuRamChartComponent, PulseDiskChartComponent, PulseNetworkChartComponent, } from './charts/';
import { AggregationSelectorComponent } from './charts/aggregation-selector.component';
import { ChartAreaComponent } from './charts/chart-area.component';
import { PulseService } from './pulse.service';
import { VmPulseComponent } from './vm-pulse/vm-pulse.component';
import { BaseChartDirective } from './charts/chart.directive';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    MaterialModule,
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
