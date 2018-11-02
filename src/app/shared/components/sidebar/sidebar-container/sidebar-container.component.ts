import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarContainerService } from '../../../services/sidebar-container.service';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { select, Store } from '@ngrx/store';
import { State } from '../../../../reducers';
import * as UserTagsSelectors from '../../../../root-store/server-data/user-tags/user-tags.selectors';
import * as UserTagsActions from '../../../../root-store/server-data/user-tags/user-tags.actions';

@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar-container.component.html',
  styleUrls: ['sidebar-container.component.scss'],
})
export class SidebarContainerComponent implements OnInit, OnChanges {
  @Input()
  @HostBinding('class.open')
  public isOpen;
  readonly sidebarWidth$ = this.store.pipe(select(UserTagsSelectors.getSidebarWidth));
  public sliderWidth: number;
  public minWidthSize = 330;
  public maxWidthSize = 660;

  constructor(
    public sidebarContainerService: SidebarContainerService,
    public cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
  ) {}

  public ngOnChanges(changes: SimpleChanges) {
    const isOpen = changes.isOpen && changes.isOpen.currentValue;
    this.sidebarContainerService.isOpen.next(isOpen);
  }

  public ngOnInit(): void {
    this.sidebarWidth$.subscribe(result => {
      this.sliderWidth = result;
      this.sidebarContainerService.width.next(this.sliderWidth);
    });
  }

  public onDetailsHide(): void {
    this.router.navigate([this.route.parent.snapshot.url], {
      queryParamsHandling: 'preserve',
    });
  }

  public onResize(event: IResizeEvent): void {
    const newSize = Math.min(Math.max(event.size.width, this.minWidthSize), this.maxWidthSize);
    this.sidebarContainerService.width.next(newSize);
  }

  public onResizeStop(event: IResizeEvent): void {
    const newSize = Math.min(Math.max(event.size.width, this.minWidthSize), this.maxWidthSize);
    this.store.dispatch(new UserTagsActions.UpdateSidebarWidth({ value: newSize.toString() }));
    this.sidebarContainerService.width.next(newSize);
  }
}
