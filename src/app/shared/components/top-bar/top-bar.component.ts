import { Component, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ListService } from '../list/list.service';
import { SidebarContainerService } from '../../services/sidebar-container.service';

@Component({
  selector: 'cs-top-bar',
  templateUrl: 'top-bar.component.html',
  styleUrls: ['top-bar.component.scss'],
})
export class TopBarComponent {
  constructor(
    private sidebarContainerService: SidebarContainerService,
    private activatedRoute: ActivatedRoute,
    @Optional() private listService: ListService,
  ) {}

  public get sidebarOpen(): boolean {
    return this.listService ? this.listService.hasSelected() && this.showSidebarForSG() : false;
  }

  public get right() {
    return this.sidebarOpen ? this.sidebarContainerService.width.getValue() : 0;
  }

  private showSidebarForSG(): boolean {
    if (this.activatedRoute.snapshot.firstChild.firstChild) {
      return this.activatedRoute.snapshot.firstChild.firstChild.routeConfig.path !== 'rules';
    }
    return true;
  }
}
