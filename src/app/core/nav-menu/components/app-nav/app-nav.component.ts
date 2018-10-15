import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Route } from '../../models';

@Component({
  selector: 'cs-app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss']
})
export class AppNavComponent {
  @Input()
  routes: Route[];
  @Input()
  currentRoute: Route;
  @Output()
  close = new EventEmitter<boolean>();
}
