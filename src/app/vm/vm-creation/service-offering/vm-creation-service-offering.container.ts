import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';

import { ComputeOfferingViewModel } from '../../view-models';
import { configSelectors, State, UserTagsActions } from '../../../root-store';
import { selectFilteredOfferingsForVmCreation } from '../../selectors';
import * as serviceOfferingActions from '../../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../../reducers/service-offerings/redux/service-offerings.reducers';
// tslint:disable-next-line
import { ServiceOfferingFromMode } from '../../../service-offering/service-offering-dialog/service-offering-dialog.component';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';

@Component({
  selector: 'cs-vm-creation-service-offering-container',
  template: `
    <cs-service-offering-dialog
      [formMode]="formMode"
      [serviceOfferings]="offerings$ | async"
      [serviceOfferingId]="serviceOfferingId"
      [classes]="classes$ | async"
      [selectedClasses]="selectedClasses$ | async"
      [viewMode]="viewMode$ | async"
      [query]="query$ | async"
      [account]="account$ | async"
      (serviceOfferingUpdated)="updateServiceOffering($event)"
      (serviceOfferingChanged)="changeServiceOffering($event)"
      (viewModeChanged)="onViewModeChange($event)"
      (selectedClassesChanged)="onSelectedClassesChange($event)"
      (queryChange)="onQueryChange($event)"
    >
    </cs-service-offering-dialog>`,
})
export class VmCreationServiceOfferingContainerComponent implements OnInit, AfterViewInit {
  readonly offerings$ = this.store.pipe(select(selectFilteredOfferingsForVmCreation));
  readonly classes$ = this.store.pipe(select(configSelectors.get('computeOfferingClasses')));
  readonly query$ = this.store.pipe(select(fromServiceOfferings.filterQuery));
  readonly selectedClasses$ = this.store.pipe(select(fromServiceOfferings.filterSelectedClasses));
  readonly viewMode$ = this.store.pipe(select(fromServiceOfferings.filterSelectedViewMode));
  readonly account$ = this.store.pipe(select(fromAccounts.selectUserAccount));

  public formMode = ServiceOfferingFromMode.SELECT;

  public serviceOffering: ComputeOfferingViewModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<VmCreationServiceOfferingContainerComponent>,
    private store: Store<State>,
    private cd: ChangeDetectorRef,
  ) {
    this.serviceOffering = data.serviceOffering;
  }

  ngOnInit() {
    this.store.dispatch(
      new serviceOfferingActions.ServiceOfferingsFilterUpdate(fromServiceOfferings.initialFilters),
    );
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public get serviceOfferingId(): string {
    return this.serviceOffering && this.serviceOffering.id;
  }

  public onViewModeChange(selectedViewMode: string) {
    this.store.dispatch(
      new serviceOfferingActions.ServiceOfferingsFilterUpdate({ selectedViewMode }),
    );
  }

  public onSelectedClassesChange(selectedClasses: string[]) {
    this.store.dispatch(
      new serviceOfferingActions.ServiceOfferingsFilterUpdate({ selectedClasses }),
    );
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new serviceOfferingActions.ServiceOfferingsFilterUpdate({ query }));
  }

  public updateServiceOffering(offering: ComputeOfferingViewModel) {
    if (offering.iscustomized) {
      this.store.dispatch(new UserTagsActions.UpdateCustomServiceOfferingParams({ offering }));
    }
  }

  public changeServiceOffering(serviceOffering) {
    this.dialogRef.close(serviceOffering);
  }
}
