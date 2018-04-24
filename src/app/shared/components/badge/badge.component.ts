import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-badge',
  template: `
    <div [class.badge]="isActive" [attr.data-badge]="count">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() count: number;

  public get isActive(): boolean {
    return !!this.count;
  }
}
