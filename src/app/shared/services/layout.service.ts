import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class LayoutService {
  public drawerToggled = new Subject<void>();
}
