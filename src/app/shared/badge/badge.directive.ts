import { Directive, HostBinding, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[csBadge]'
})
export class BadgeDirective {
  @HostBinding('class.badge') public readonly badge = true;
  @HostBinding('class.mdl-color-accent') public readonly color = true;
  @HostBinding('attr.data-badge') @Input() public csBadge: string;

  @HostBinding('class.badge--overlap') private shouldOverlap = false;

  @Input()
  public get csBadgeOverlap(): boolean {
    return this.shouldOverlap;
  }

  public set csBadgeOverlap(val: boolean) {
    this.shouldOverlap = coerceBooleanProperty(val);
  }
}
