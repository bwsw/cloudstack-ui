import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as resourceQuotasActions from '../../redux/resource-quotas.actions';
import { State } from '../../../root-store';
import * as fromResourceQuotas from '../../redux/resource-quotas.reducer';
import * as fromAdminForm from '../../redux/resource-quotas-admin-form.reducer';

@Component({
  selector: 'cs-resource-quotas-container',
  template: `
    <cs-resource-quotas
      *loading="(isLoading$ | async)"
      [resourceQuotas]="resourceQuotas$ | async"
      (fieldChange)="onFieldChange($event)"
    ></cs-resource-quotas>
  `,
})
export class ResourceQuotasContainerComponent implements OnInit {
  readonly resourceQuotas$ = this.store.pipe(select(fromAdminForm.getAdminResourceQuotasForm));
  readonly isLoading$ = this.store.pipe(select(fromResourceQuotas.isLoading));

  constructor(private store: Store<State>) {}

  public ngOnInit() {
    this.store.dispatch(new resourceQuotasActions.LoadResourceQuotasRequest());
  }

  public onFieldChange(params) {
    this.store.dispatch(new resourceQuotasActions.UpdateAdminFormField(params));
  }
}
