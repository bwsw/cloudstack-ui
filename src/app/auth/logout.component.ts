import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { State } from '../root-store';
import { AuthService } from '../shared/services/auth.service';
import { RouterUtilsService } from '../shared/services/router-utils.service';
import { LogoutComplete } from './store/auth.actions';

@Component({
  selector: 'cs-logout',
  template: '<div></div>',
})
export class LogoutComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<State>,
    private routerUtilsService: RouterUtilsService,
  ) {}

  public ngOnInit(): void {
    this.authService.logout().subscribe(() => {
      this.store.dispatch(new LogoutComplete());
      const next = this.activatedRoute.snapshot.queryParams['next'];
      const redirectionParams = next ? this.routerUtilsService.getRedirectionQueryParams(next) : {};
      this.router.navigate(['/login'], redirectionParams);
      this.dialog.closeAll();
    });
  }
}
