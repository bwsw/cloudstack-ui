import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-badge',
  template: `
    <div class="badge"
      *ngIf="true"
      [csBadge]="count"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .badge {
      display: inline-block;
    }
  `]
})
export class BadgeComponent {
  @Input() count: number;
}
