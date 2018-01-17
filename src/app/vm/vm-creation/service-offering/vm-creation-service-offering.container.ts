import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import * as fromAccountTags from '../../../reducers/account-tags/redux/account-tags.reducers';
import { State } from '../../../reducers/index';
import * as fromSOClasses from '../../../reducers/service-offerings/redux/service-offering-class.reducers';

import * as serviceOfferingActions from '../../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../../reducers/service-offerings/redux/service-offerings.reducers';
// tslint:disable-next-line
import { ICustomOfferingRestrictions } from '../../../service-offering/custom-service-offering/custom-offering-restrictions';
import { ServiceOfferingFromMode } from '../../../service-offering/service-offering-dialog/service-offering-dialog.component';
import { ServiceOffering } from '../../../shared/models/service-offering.model';


@Component({
  selector: 'cs-vm-creation-service-offering-container',
  template: `
    <cs-service-offering-dialog
      [formMode]="formMode"
      [serviceOfferings]="offerings$ | async"
      [serviceOfferingId]="serviceOfferingId"
      [classes]="classes$ | async"
      [selectedClasses]="selectedClasses$ | async"
      [classTags]="classTags$ | async"
      [viewMode]="viewMode$ | async"
      [query]="query$ | async"
      [restrictions]="customOfferingRestrictions"
      [defaultParams]="defaultParams$ | async"
      (onServiceOfferingUpdate)="updateServiceOffering($event)"
      (onServiceOfferingChange)="changeServiceOffering($event)"
      (viewModeChange)="onViewModeChange($event)"
      (selectedClassesChange)="onSelectedClassesChange($event)"
      (queryChange)="onQueryChange($event)"
    >
    </cs-service-offering-dialog>`
})
export class VmCreationServiceOfferingContainerComponent {
  readonly offerings$ = this.store.select(fromServiceOfferings.selectFilteredOfferingsForVmCreation);
  readonly defaultParams$ = this.store.select(fromServiceOfferings.getDefaultParams);
  readonly classes$ = this.store.select(fromSOClasses.selectAll);
  readonly query$ = this.store.select(fromServiceOfferings.filterQuery);
  readonly selectedClasses$ = this.store.select(fromServiceOfferings.filterSelectedClasses);
  readonly classTags$ = this.store.select(fromAccountTags.selectServiceOfferingClassTags);
  readonly viewMode$ = this.store.select(fromServiceOfferings.filterSelectedViewMode);

  public formMode = ServiceOfferingFromMode.SELECT;

  public serviceOffering: ServiceOffering;
  public customOfferingRestrictions: ICustomOfferingRestrictions;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<VmCreationServiceOfferingContainerComponent>,
    private store: Store<State>
  ) {
    this.serviceOffering = data.serviceOffering;
    this.customOfferingRestrictions = data.restriction;
  }

  public get serviceOfferingId(): string {
    return this.serviceOffering && this.serviceOffering.id;
  }

  public onViewModeChange(selectedViewMode: string) {
    this.store.dispatch(new serviceOfferingActions.ServiceOfferingsFilterUpdate({ selectedViewMode }));
  }

  public onSelectedClassesChange(selectedClasses: string[]) {
    this.store.dispatch(new serviceOfferingActions.ServiceOfferingsFilterUpdate({ selectedClasses }));
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new serviceOfferingActions.ServiceOfferingsFilterUpdate({ query }));
  }

  public updateServiceOffering(serviceOffering) {
    this.store.dispatch(new serviceOfferingActions.UpdateCustomServiceOffering(serviceOffering));
  }

  public changeServiceOffering(serviceOffering) {
    this.dialogRef.close(serviceOffering);
  }
}
