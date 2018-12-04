import { Component, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ListService } from '../list/list.service';
import { SidebarWidthService } from '../../../core/services';

@Component({
  selector: 'cs-top-bar',
  templateUrl: 'top-bar.component.html',
  styleUrls: ['top-bar.component.scss'],
})
export class TopBarComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private sidebarWidthService: SidebarWidthService,
    @Optional() private listService: ListService,
  ) {}

  public get sidebarOpen(): boolean {
    return this.listService ? this.listService.hasSelected() && this.showSidebarForSG() : false;
  }

  public get rightIndent(): number {
    if (!this.sidebarOpen) {
      return 0;
    }

    return this.sidebarWidthService.widthBehaviorSubject.value;
  }

  // todo: refactor
  private showSidebarForSG(): boolean {
    if (this.activatedRoute.snapshot.firstChild.firstChild) {
      return this.activatedRoute.snapshot.firstChild.firstChild.routeConfig.path !== 'rules';
    }
    return true;
  }
}
