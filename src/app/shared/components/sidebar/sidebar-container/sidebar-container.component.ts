import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { SidebarWidthService } from '../../../../core/services';
import { layoutStore, State, UserTagsSelectors } from '../../../../root-store';
import * as UserTagsActions from '../../../../root-store/server-data/user-tags/user-tags.actions';

@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar-container.component.html',
  styleUrls: ['sidebar-container.component.scss'],
})
export class SidebarContainerComponent implements OnChanges {
  @Input()
  @HostBinding('class.open')
  public isOpen;
  public sidebarWidth$ = this.store.pipe(select(UserTagsSelectors.getSidebarWidth));

  constructor(
    private sidebarWidthService: SidebarWidthService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
  ) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.isOpen) {
      if (changes.isOpen.currentValue === true) {
        this.store.dispatch(new layoutStore.actions.OpenSidebar());
      } else {
        this.store.dispatch(new layoutStore.actions.CloseSidebar());
      }
    }
  }

  public onDetailsHide(): void {
    this.router.navigate([this.route.parent.snapshot.url], {
      queryParamsHandling: 'preserve',
    });
  }

  public onResize(event: IResizeEvent): void {
    this.sidebarWidthService.setWidth(event.size.width);
  }

  public onResizeStop(event: IResizeEvent): void {
    const width = event.size.width;
    this.sidebarWidthService.setWidth(width);
    this.store.dispatch(new UserTagsActions.UpdateSidebarWidth({ value: String(width) }));
  }
}
