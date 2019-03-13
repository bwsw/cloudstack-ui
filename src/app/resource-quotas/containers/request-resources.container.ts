import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as resourceQuotasActions from '../redux/resource-quotas.actions';
import { State } from '../../root-store';
import * as fromResourceQuotas from '../redux/resource-quotas.reducer';
import * as fromUserForm from '../redux/resource-quotas-user-form.reducer';
import { LoadResourceLimitsForCurrentUser } from '../../reducers/resource-limit/redux/resource-limits.actions';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import * as fromResourceLimits from '../../reducers/resource-limit/redux/resource-limits.reducers';
import { getModifiedLimits } from '../redux/selectors/modified-limits.selector';

@Component({
  selector: 'cs-request-resources-container',
  template: `
    <ng-container *ngIf="(formNotShown$ | async) === false">
      <cs-request-resources
        *loading="(isLoading$ | async)"
        [resourceQuotas]="resourceQuotas$ | async"
        [resourceLimits]="resourceLimits$ | async"
        [isRequestButtonActive]="(limitsChanged$ | async) && (isSaving$ | async) === false"
        (limitChange)="onLimitChange($event)"
        (update)="onUpdate($event)"
      ></cs-request-resources>
    </ng-container>
    <div *ngIf="(formNotShown$ | async)">
      <div class="mat-dialog-content">
        <cs-no-results
          [text]="'RESOURCE_QUOTAS_PAGE.REQUEST.CAN_NOT_CHANGE_RESOURCES'"
        ></cs-no-results>
      </div>
      <div class="mat-dialog-actions">
        <button mat-button color="primary" matDialogClose type="button">
          {{ 'COMMON.OK' | translate }}
        </button>
      </div>
    </div>
  `,
})
export class RequestResourcesContainerComponent implements OnInit {
  readonly resourceQuotas$ = this.store.pipe(select(fromUserForm.getUserResourceQuotas));
  readonly resourceLimits$ = this.store.pipe(select(fromUserForm.getUserResourceLimits));
  readonly isSaving$ = this.store.pipe(select(fromUserForm.isUserResourceLimitsSaving));
  readonly failedToLoadQuotas$ = this.store.pipe(select(fromResourceQuotas.isErrorState));

  readonly noResourceAvailableForChange$ = this.resourceQuotas$.pipe(
    map(resourceQuotas => Object.keys(resourceQuotas).length === 0),
  );
  readonly quotasLoading$ = this.store.pipe(
    select(fromResourceQuotas.isLoaded),
    map(isLoading => !isLoading),
  );
  readonly limitsLoading$ = this.store.pipe(
    select(fromResourceLimits.isLoaded),
    map(isLoading => !isLoading),
  );
  readonly isLoading$ = combineLatest(this.quotasLoading$, this.limitsLoading$).pipe(
    map(loadings => loadings.some(Boolean)),
  );
  readonly formNotShown$ = combineLatest(
    this.failedToLoadQuotas$,
    this.noResourceAvailableForChange$,
    this.isLoading$,
  ).pipe(
    map(([failedToLoadQuotas, noQuotas, loading]) => {
      if (failedToLoadQuotas) {
        return true;
      }

      if (loading) {
        return false;
      }

      return noQuotas;
    }),
  );
  readonly limitsChanged$ = this.store.pipe(
    select(getModifiedLimits),
    map(limits => limits.length > 0),
  );

  constructor(private store: Store<State>) {}

  public ngOnInit() {
    this.store.dispatch(new resourceQuotasActions.LoadResourceQuotasRequest());
    // todo: fix resource limits action types
    this.store.dispatch(new LoadResourceLimitsForCurrentUser(null));
  }

  public onLimitChange(params) {
    this.store.dispatch(new resourceQuotasActions.UpdateUserFormField(params));
  }

  public onUpdate() {
    this.store.dispatch(new resourceQuotasActions.UpdateResourceLimitsRequest());
  }
}
