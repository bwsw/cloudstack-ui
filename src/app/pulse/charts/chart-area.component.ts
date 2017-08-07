import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PulseChart } from './pulse-chart';

@Component({
  selector: 'cs-chart-area-component',
  template: `
    <div style="display: block;">
      <div *ngFor="let chart of charts" class="chart">
        <div *ngIf="chart.datasets?.length" class="arrow" (click)="previous.emit()">
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
      margin: auto;
      height: 19vh;
    }

    .arrow {
      display: flex;
      align-self: center;
      position: absolute;
      width: 30px;
      height: 50px;
      background: rgba(0, 0, 0, 0.2);
      opacity: 0.2;
      cursor: pointer;
    }

    .arrow:hover {
      opacity: 1;
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
