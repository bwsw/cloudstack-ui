import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StateIndicator } from './state-indicator';

@Component({
  selector: 'cs-square-state-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="square-state-indicator"
      [ngClass]="state"
    ></div>
  `,
  styleUrls: ['./state-indicator.scss', './square-state-indicator.component.scss'],
})
export class SquareStateIndicatorComponent extends StateIndicator {}
