import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[csSettingsSectionContent]' })
export class SettingsSectionContentDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.marginLeft = '20px';
    el.nativeElement.style.width = '260px';
  }
}
