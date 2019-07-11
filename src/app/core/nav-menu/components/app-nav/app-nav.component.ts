import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Route } from '../../models';
import { User } from '../../../../shared/models';

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
  public account: Account;
  @Input()
  public user: User;
}
