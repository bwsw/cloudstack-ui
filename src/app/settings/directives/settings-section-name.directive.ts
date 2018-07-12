import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[csSettingsSectionName]' })
export class SettingsSectionNameDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.fontSize = '22px';
    el.nativeElement.style.margin = '0'
  }
}
