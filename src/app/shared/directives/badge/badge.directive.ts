import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[csBadge]',
})
export class BadgeDirective {
  @HostBinding('class.badge')
  public get isActive(): boolean {
    return !!this.count;
  }

  // tslint:disable-next-line
  @HostBinding('attr.data-badge')
  @Input('csBadge')
  public count: string;
}
