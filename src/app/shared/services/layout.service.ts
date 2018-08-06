import { Injectable } from '@angular/core';
import { State, UserTagsActions, UserTagsSelectors } from '../../root-store';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LayoutService {
  public drawerOpen: boolean;
  public drawerToggled: Subject<void>;

  constructor(private store: Store<State>) {
    this.drawerToggled = new Subject<void>();
    this.initSidebarDrawerState();
  }

  public toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
    this.store.dispatch(new UserTagsActions.UpdateSidebarDrawerState({ value: this.drawerOpen.toString() }));
  }

  public initSidebarDrawerState() {
    this.store.select(UserTagsSelectors.getSidebarDrawerState)
      .filter(Boolean)
      .subscribe(state => {
        this.drawerOpen = state === 'true';
      })
  }
}
