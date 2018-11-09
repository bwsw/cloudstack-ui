import { Directive, Input, OnInit } from '@angular/core';
import { MatTabNav } from '@angular/material';
import { debounceTime, filter } from 'rxjs/operators';
import { SidebarWidthService } from '../../core/services';

/**
 * The directive is used to update the TabNav Ink Bar when the sidebar is resized.
 */
@Directive({
  selector: '[csSidebarTabNav]',
})
export class SidebarTabNavDirective implements OnInit {
  // tslint:disable no-input-rename
  @Input('csSidebarTabNav')
  public matTabs: MatTabNav;

  constructor(public sidebarContainerService: SidebarWidthService) {}

  public ngOnInit() {
    this.sidebarContainerService.width
      .pipe(
        debounceTime(50),
        filter(Boolean),
      )
      .subscribe(() => {
        this.matTabs._alignInkBar();
      });
  }
}
