import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { configSelectors, State } from '../root-store';
import { AuthService } from '../shared/services/auth.service';

@Injectable()
export class ResourceQuotasEnabledGuard implements CanActivate {
  constructor(
    private store: Store<State>,
    private router: Router,
    private authService: AuthService,
  ) {}

  public canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(configSelectors.get('extensions')),
      map(({ resourceLimits }) => {
        if (!resourceLimits || !this.authService.isAdmin()) {
          this.router.navigate(['/']);
        }

        return resourceLimits;
      }),
    );
  }
}
