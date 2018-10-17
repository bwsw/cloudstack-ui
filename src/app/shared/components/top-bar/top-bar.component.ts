import { Component, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ListService } from '../list/list.service';
import { layoutActions, layoutSelectors, State } from '../../../root-store';

@Component({
  selector: 'cs-top-bar',
  templateUrl: 'top-bar.component.html',
  styleUrls: ['top-bar.component.scss'],
})
export class TopBarComponent {
  public isSidenavVisible$ = this.store.pipe(select(layoutSelectors.isSidenavVisible));

  constructor(
    @Optional() private listService: ListService,
    private activatedRoute: ActivatedRoute,
    private store: Store<State>,
  ) {}

  public openSidenav(): void {
    this.store.dispatch(new layoutActions.OpenSidenav());
  }

  public get sidebarOpen(): boolean {
    return this.listService ? this.listService.hasSelected() && this.showSidebarForSG() : false;
  }

  private showSidebarForSG(): boolean {
    if (this.activatedRoute.snapshot.firstChild.firstChild) {
      return this.activatedRoute.snapshot.firstChild.firstChild.routeConfig.path !== 'rules';
    }
    return true;
  }
}
