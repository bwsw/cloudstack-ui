import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as resourceQuotasActions from '../../redux/resource-quotas.actions';
import { State } from '../../../root-store';
import * as fromResourceQuotas from '../../redux/resource-quotas.reducer';
import * as fromUserForm from '../../redux/resource-quotas-user-form.reducer';
import { LoadResourceLimitsForCurrentUser } from '../../../reducers/resource-limit/redux/resource-limits.actions';
import * as fromResourceLimits from '../../../reducers/resource-limit/redux/resource-limits.reducers';

@Component({
  selector: 'cs-request-resources-container',
  template: `
    <ng-container *ngIf="(isErrorState$ | async) === false">
      <cs-request-resources
        *loading="(isLoading$ | async)"
        [resourceQuotas]="resourceQuotas$ | async"
        [resourceLimits]="resourceLimits$ | async"
      ></cs-request-resources>
    </ng-container>
    <cs-no-results
      *ngIf="(isErrorState$ | async)"
      [text]="'RESOURCE_QUOTAS_PAGE.ADMIN_PAGE.QUOTA_LOAD_ERROR'"
    ></cs-no-results>
  `,
})
export class RequestResourcesContainerComponent implements OnInit {
  readonly resourceQuotas$ = this.store.pipe(select(fromUserForm.getUserResourceQuotasForm));
  readonly resourceLimits$ = this.store.pipe(select(fromResourceLimits.selectEntities));
  readonly isLoading$ = this.store.pipe(select(fromResourceQuotas.isLoading));
  readonly isErrorState$ = this.store.pipe(select(fromResourceQuotas.isErrorState));

  constructor(private store: Store<State>) {}

  public ngOnInit() {
    this.store.dispatch(new resourceQuotasActions.LoadResourceQuotasRequest());
    // todo: fix resource limits action types
    this.store.dispatch(new LoadResourceLimitsForCurrentUser(null));
  }
}
