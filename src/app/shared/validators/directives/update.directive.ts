import { ChangeDetectorRef, Directive, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { MatTabNav } from '@angular/material';
import { SidebarContainerService } from '../../services/sidebar-container.service';
import { debounceTime, filter } from 'rxjs/operators';

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
export class UpdateDirective implements OnInit {
  // tslint:disable no-input-rename
  @Input('csUpdate')
  public matTabs: MatTabNav;

  constructor(
    public sidebarContainerService: SidebarContainerService,
    public cd: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.sidebarContainerService.sidebarWidth
      .pipe(
        debounceTime(50),
        filter(Boolean),
      )
      .subscribe(() => {
        this.matTabs._alignInkBar();
      });
  }
}
