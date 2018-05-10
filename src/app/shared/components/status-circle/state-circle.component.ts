import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cs-state-circle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-icon
      class="mdi-circle"
      [ngClass]="state"
    ></mat-icon>
  `,
  styleUrls: ['./state-circle.component.scss']
})
export class StateCircleComponent {
  // All supported states listed as css rules
  @Input() state: string;
}
