import { Component } from '@angular/core';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'cs-top-bar',
  templateUrl: 'top-bar.component.html',
  styleUrls: ['top-bar.component.scss']
})
export class TopBarComponent {
  constructor(private layoutService: LayoutService) {}

  public toggleDrawer(): void {
    this.layoutService.drawerToggled.next();
  }

  public get isDrawerOpen(): boolean {
    return this.layoutService.drawerOpen;
  }
}
