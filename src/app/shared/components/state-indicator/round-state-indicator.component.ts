import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StateIndicator } from './state-indicator';

@Component({
  selector: 'cs-round-state-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-icon
      class="mdi-circle"
      [ngClass]="state"
    ></mat-icon>
  `,
  styleUrls: ['./state-indicator.scss', './round-state-indicator.component.scss'],
})
export class RoundStateIndicatorComponent extends StateIndicator {}
