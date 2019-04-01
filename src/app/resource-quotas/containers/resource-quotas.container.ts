import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as resourceQuotasActions from '../redux/resource-quotas.actions';
import { State } from '../../root-store';
import * as fromResourceQuotas from '../redux/resource-quotas.reducer';
import * as fromAdminForm from '../redux/resource-quotas-admin-form.reducer';
import { map } from 'rxjs/operators';
import { getModifiedQuotas } from '../redux/selectors/modified-quotas.selector';

@Component({
  selector: 'cs-resource-quotas-container',
  template: `
    <ng-container *ngIf="(isErrorState$ | async) === false">
      <cs-resource-quotas
        *loading="(isLoading$ | async)"
        [resourceQuotas]="resourceQuotas$ | async"
        [isUpdateButtonActive]="(quotasChanged$ | async) && (isSaving$ | async) === false"
        (fieldChange)="onFieldChange($event)"
        (update)="onUpdate()"
      ></cs-resource-quotas>
    </ng-container>
    <cs-no-results
      *ngIf="(isErrorState$ | async)"
      [text]="'RESOURCE_QUOTAS_PAGE.ADMIN_PAGE.QUOTA_LOAD_ERROR'"
    ></cs-no-results>
  `,
})
export class ResourceQuotasContainerComponent implements OnInit {
  readonly resourceQuotas$ = this.store.pipe(select(fromAdminForm.getAdminResourceQuotasForm));
  readonly isSaving$ = this.store.pipe(select(fromAdminForm.isAdminResourceQuotasSaving));
  readonly isLoading$ = this.store.pipe(
    select(fromResourceQuotas.isLoaded),
    map(isLoaded => !isLoaded),
  );
  readonly isErrorState$ = this.store.pipe(select(fromResourceQuotas.isErrorState));
  readonly quotasChanged$ = this.store.pipe(
    select(getModifiedQuotas),
    map(quotas => quotas.length > 0),
  );

  constructor(private store: Store<State>) {}

  public ngOnInit() {
    this.store.dispatch(new resourceQuotasActions.LoadResourceQuotasRequest());
  }

  public onFieldChange(params) {
    this.store.dispatch(new resourceQuotasActions.UpdateAdminFormField(params));
  }

  public onUpdate() {
    this.store.dispatch(new resourceQuotasActions.UpdateResourceQuotasRequest());
  }
}
