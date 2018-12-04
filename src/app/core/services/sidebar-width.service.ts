import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { layoutStore, State, UserTagsSelectors } from '../../root-store';

/**
 * The service is used to get the size of the indent for floating elements relative to the sidebar,
 * such as the notification bell and FAB.
 * To get the sidebar width, without intermediate results, use store.
 */
@Injectable()
export class SidebarWidthService {
  public readonly width$: Observable<number>;
  public widthBehaviorSubject = new BehaviorSubject(0);

  constructor(private store: Store<State>) {
    this.width$ = this.widthBehaviorSubject.asObservable();
    this.initializeSidebarWidthFromTag();
  }

  public getWidth(): number {
    return this.widthBehaviorSubject.value;
  }

  public setWidth(value: number) {
    this.widthBehaviorSubject.next(value);
  }

  private initializeSidebarWidthFromTag() {
    const width$ = this.store.pipe(select(UserTagsSelectors.getSidebarWidth));
    const isSidebarOpen$ = this.store.pipe(select(layoutStore.selectors.getShowSidebar));
    combineLatest(width$, isSidebarOpen$).subscribe(([width, isOpen]: [number, boolean]) =>
      this.setWidth(isOpen ? width : 0),
    );
  }
}
