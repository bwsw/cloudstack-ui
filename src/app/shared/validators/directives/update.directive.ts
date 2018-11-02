import { AfterViewInit, ChangeDetectorRef, Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { MatTabNav } from '@angular/material';

@Directive({
  selector: '[csUpdate]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UpdateDirective,
      multi: true,
    },
  ],
})
export class UpdateDirective implements AfterViewInit {
  // tslint:disable no-input-rename
  @Input('csUpdate')
  public matTabs: MatTabNav;

  constructor(public cd: ChangeDetectorRef) {}

  public ngAfterViewInit() {
    this.cd.detectChanges();
    setInterval(() => {
      this.matTabs._alignInkBar();
    }, 50);
  }
}
