import { Component, Input } from '@angular/core';
import { PulseChart } from './pulse-chart';

@Component({
  selector: 'cs-chart-area-component',
  template: `
    <div style="display: block;">
      <ng-container *ngFor="let chart of charts">
        <canvas
          *ngIf="chart.datasets?.length"
          baseChart
          [datasets]="chart.datasets"
          [chartType]="chart.chartType"
          [options]="chart.options"
          [labels]="chart.labels"
        ></canvas>
      </ng-container>
    </div>
  `
})
export class ChartAreaComponent {
  @Input() public charts: Array<PulseChart>;
}
