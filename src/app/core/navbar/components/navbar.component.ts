import { Component, Input } from '@angular/core';
import { ButtonState, SearchBoxState, NavbarService } from '../../services/navbar.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { AuthService } from '../../../shared/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Route } from '../../nav-menu/models';

@Component({
  selector: 'cs-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent extends WithUnsubscribe() {
  @Input()
  public routes: Route[];
  @Input()
  public currentRoute: Route;
  @Input()
  public currentSubroute: Route;

  public searchBoxOpen = false;
  public searchBoxState: SearchBoxState = this.toolbar.defaultSearchBoxState;
  public buttonState: ButtonState;

  constructor(private auth: AuthService, private toolbar: NavbarService) {
    super();
    this.toolbar.searchBoxState$.pipe(takeUntil(this.unsubscribe$)).subscribe(searchBoxState => {
      this.searchBoxState = searchBoxState;
    });
    this.toolbar.buttonState$.pipe(takeUntil(this.unsubscribe$)).subscribe(buttonState => {
      this.buttonState = buttonState;
    });
  }

  public onSearchBoxClose() {
    this.searchBoxState.query = '';
    this.searchBoxState.event(this.searchBoxState.query);
    this.searchBoxOpen = false;
  }
}
