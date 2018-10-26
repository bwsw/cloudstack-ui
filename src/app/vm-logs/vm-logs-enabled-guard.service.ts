import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { configSelectors, State } from '../root-store';

@Injectable()
export class VmLogsEnabledGuard implements CanActivate {
  constructor(private store: Store<State>, private router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(configSelectors.get('extensions')),
      map(({ vmLogs }) => {
        if (!vmLogs) {
          this.router.navigate(['/']);
        }

        return vmLogs;
      }),
    );
  }
}
