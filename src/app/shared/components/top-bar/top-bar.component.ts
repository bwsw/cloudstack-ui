import { Component, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { ListService } from '../list/list.service';

@Component({
  selector: 'cs-top-bar',
  templateUrl: 'top-bar.component.html',
  styleUrls: ['top-bar.component.scss']
})
export class TopBarComponent {
  constructor(
    @Optional() private listService: ListService,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService
  ) {
  }

  public toggleDrawer(): void {
    this.layoutService.drawerToggled.next();
  }

  public get isDrawerOpen(): boolean {
    return this.layoutService.drawerOpen;
  }

  public get sidebarOpen(): boolean {
    return this.listService
      ? this.listService.hasSelected() && this.showSidebarForSG()
      : false;
  }

  private showSidebarForSG(): boolean {
    if (this.activatedRoute.snapshot.firstChild.firstChild) {
      return this.activatedRoute.snapshot.firstChild.firstChild.routeConfig.path !== 'rules';
    } else {
      return true;
    }
  }
}
