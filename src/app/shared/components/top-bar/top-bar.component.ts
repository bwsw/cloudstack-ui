import { Component, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ListService } from '../list/list.service';
import { layoutActions, layoutSelectors, State } from '../../../root-store';
import { SidebarContainerService } from '../../services/sidebar-container.service';

@Component({
  selector: 'cs-top-bar',
  templateUrl: 'top-bar.component.html',
  styleUrls: ['top-bar.component.scss']
})
export class TopBarComponent {
  public isSidenavVisible$ = this.store.select(layoutSelectors.isSidenavVisible);

  constructor(
    private sidebarContainerService: SidebarContainerService,
    @Optional() private listService: ListService,
    private activatedRoute: ActivatedRoute,
    private store: Store<State>
  ) {
  }

  public openSidenav(): void {
    this.store.dispatch(new layoutActions.OpenSidenav());
  }

  public get sidebarOpen(): boolean {
    return this.listService
      ? this.listService.hasSelected() && this.showSidebarForSG()
      : false;
  }

  public get right() {
    return this.sidebarOpen ? this.sidebarContainerService.width.getValue() : 0;
  }

  private showSidebarForSG(): boolean {
    if (this.activatedRoute.snapshot.firstChild.firstChild) {
      return this.activatedRoute.snapshot.firstChild.firstChild.routeConfig.path !== 'rules';
    } else {
      return true;
    }
  }
}
