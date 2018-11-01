import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';

@Injectable()
export class SidebarContainerService {
  readonly width = new BehaviorSubject(330);
  readonly isOpen = new BehaviorSubject(false);
  readonly sidebarWidth = (this.isOpen ? this.width : new BehaviorSubject(0)).asObservable();
}
