import { Component, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ListService } from '../list/list.service';

@Component({
  selector: 'cs-top-bar',
  templateUrl: 'top-bar.component.html',
  styleUrls: ['top-bar.component.scss'],
})
export class TopBarComponent {
  constructor(
    @Optional() private listService: ListService,
    private activatedRoute: ActivatedRoute,
  ) {}

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
