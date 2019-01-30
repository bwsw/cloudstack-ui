import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { configSelectors, State } from '../../root-store';
import { SettingsPageViewMode } from '../../settings/types/settings-page-view-mode';

@Injectable()
export class LogViewGuard implements CanActivate {
  public logViewEnabled$ = this.store.pipe(
    select(configSelectors.get('extensions')),
    map(extensions => extensions.vmLogs),
  );

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  public canActivate(_, state: RouterStateSnapshot): Observable<boolean> {
    return this.logViewEnabled$.pipe(
      map(logViewEnabled => {
        this.activatedRoute.queryParams.subscribe(params => {
          if (params['viewMode'] === SettingsPageViewMode.LogView && !logViewEnabled) {
            this.router.navigate(['/settings'], {
              queryParams: { viewMode: SettingsPageViewMode.Security },
            });
          }
        });
        return true;
      }),
    );
  }
}
