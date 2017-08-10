import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PulseChart } from './pulse-chart';

@Component({
  selector: 'cs-chart-area-component',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.scss']
})
export class ChartAreaComponent {
  @Input() public charts: Array<PulseChart>;
  @Input() public hasNext: boolean;
  @Input() public fetching;
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
}
