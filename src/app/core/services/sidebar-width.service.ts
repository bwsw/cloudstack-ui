import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, filter, first, withLatestFrom } from 'rxjs/operators';
import { State, UserTagsSelectors, layoutStore } from '../../root-store';

/**
 * The service is used to get the size of the indent for floating elements relative to the sidebar,
 * such as the notification bell and FAB.
 * To get the sidebar width, without intermediate results, use store.
 */
@Injectable()
export class SidebarWidthService {
  public readonly width: Observable<number>;
  private widthBehaviorSubject = new BehaviorSubject(0);

  constructor(private store: Store<State>) {
    this.width = this.widthBehaviorSubject.asObservable();
    this.initializeSidebarWidthFromTag();
  }

  public setWidth(value: number) {
    this.widthBehaviorSubject.next(value);
  }

  private initializeSidebarWidthFromTag() {
    this.store
      .pipe(
        select(UserTagsSelectors.getIsLoaded),
        filter(Boolean),
        delay(1),
        first(),
      )
      .subscribe(() => {
        this.store
          .pipe(
            select(layoutStore.selectors.getShowSidebar),
            withLatestFrom(this.store.pipe(select(UserTagsSelectors.getSidebarWidth))),
          )
          .subscribe(([isOpen, width]: [boolean, number]) => this.setWidth(isOpen ? width : 0));
      });
  }
}
