import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as resourceQuotasActions from '../../redux/resource-quotas.actions';
import { State } from '../../../root-store';
import * as fromResourceQuotas from '../../redux/resource-quotas.reducer';
import * as fromAdminForm from '../../redux/resource-quotas-admin-form.reducer';

@Component({
  selector: 'cs-request-resources-container',
  template: `
    <ng-container *ngIf="(isErrorState$ | async) === false">
      <cs-request-resources
        *loading="(isLoading$ | async)"
        [resourceQuotas]="resourceQuotas$ | async"
      ></cs-request-resources>
    </ng-container>
    <cs-no-results
      *ngIf="(isErrorState$ | async)"
      [text]="'RESOURCE_QUOTAS_PAGE.ADMIN_PAGE.LIMIT_LOAD_ERROR'"
    ></cs-no-results>
  `,
})
export class RequestResourcesContainerComponent implements OnInit {
  readonly resourceQuotas$ = this.store.pipe(select(fromAdminForm.getAdminResourceQuotasForm));
  readonly isLoading$ = this.store.pipe(select(fromResourceQuotas.isLoading));
  readonly isErrorState$ = this.store.pipe(select(fromResourceQuotas.isErrorState));

  constructor(private store: Store<State>) {}

  public ngOnInit() {
    this.store.dispatch(
      new resourceQuotasActions.LoadResourceQuotasRequest({
        showLoader: true,
      }),
    );
  }
}
