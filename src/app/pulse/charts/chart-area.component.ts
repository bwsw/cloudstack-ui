import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PulseChart } from './pulse-chart';

@Component({
  selector: 'cs-chart-area-component',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.scss'],
})
export class ChartAreaComponent {
  @Input()
  public charts: PulseChart[];
  @Input()
  public hasNext: boolean;
  @Input()
  public fetching;
  @Input()
  public error;
  @Output()
  previous = new EventEmitter();
  @Output()
  next = new EventEmitter();

  public hasDatasets(chart: PulseChart) {
    return !!chart && !!chart.datasets && !!chart.datasets.length;
  }

  public hasData(chart: PulseChart) {
    return this.hasDatasets(chart) && !!chart.datasets[0].data && !!chart.datasets[0].data.length;
  }
}
