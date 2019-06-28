import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Route } from '../../models';

@Component({
  selector: 'cs-app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss'],
})
export class AppNavComponent {
  @Input()
  public routes: Route[];
  @Input()
  public currentRoute: Route;
  @Input()
  public username: string;
}
