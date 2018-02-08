import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class LayoutService {
  public drawerOpen: boolean;
  public drawerToggled: Subject<void>;

  constructor(
    protected localStorageService: LocalStorageService
  ) {
    this.drawerOpen = this.localStorageService.read('sidebarDrawer') === 'true';
    this.drawerToggled = new Subject<void>();
  }

  public toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
    this.localStorageService.write('sidebarDrawer', this.drawerOpen.toString());
  }
}
