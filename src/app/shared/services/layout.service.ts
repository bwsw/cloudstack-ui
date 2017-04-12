import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LayoutService {
  public drawerOpen: boolean;
  public drawerToggled: Subject<void>;

  constructor() {
    this.drawerOpen = true;
    this.drawerToggled = new Subject<void>();
  }

  public toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }
}
