import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PulseChart } from './pulse-chart';

@Component({
  selector: 'cs-chart-area-component',
  template: `
    <div style="display: block;">
      <div *ngFor="let chart of charts" class="chart">
        <div class="arrow" (click)="previous.emit()">
          <md-icon>keyboard_arrow_left</md-icon>
        </div>
        <canvas
          *ngIf="chart.datasets?.length"
          baseChart
          [datasets]="chart.datasets"
          [chartType]="chart.chartType"
          [options]="chart.options"
          [labels]="chart.labels"
        ></canvas>
        <div *ngIf="hasNext" class="arrow" (click)="next.emit()">
          <md-icon>keyboard_arrow_right</md-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart {
      display: flex;
      position: relative;
      align-items: center;

    }

    .arrow {
      width: 50px;
      height: 100px;
      position: absolute;
      background: rgba(0, 0, 0, 0.2);
      display: flex;
      margin: auto;
    }

    .arrow:last-child {
      right: 0;
    }

    .arrow md-icon {
      margin: auto;
    }
  `]
})
export class ChartAreaComponent {
  @Input() public charts: Array<PulseChart>;
  @Input() public hasNext: boolean;
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
}
