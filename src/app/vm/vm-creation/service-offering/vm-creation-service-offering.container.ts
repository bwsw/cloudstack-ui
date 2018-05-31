import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { State } from '../../../reducers';
import * as fromSOClasses from '../../../reducers/service-offerings/redux/service-offering-class.reducers';
import * as serviceOfferingActions from '../../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../../reducers/service-offerings/redux/service-offerings.reducers';
import { ICustomOfferingRestrictions, ServiceOffering } from '../../../shared/models';
// tslint:disable-next-line
import { ServiceOfferingFromMode } from '../../../service-offering/service-offering-dialog/service-offering-dialog.component';


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
export class VmCreationServiceOfferingContainerComponent implements OnInit, AfterViewInit {
  readonly offerings$ = this.store.select(fromServiceOfferings.selectFilteredOfferingsForVmCreation);
  readonly defaultParams$ = this.store.select(fromServiceOfferings.getDefaultParams);
  readonly classes$ = this.store.select(fromSOClasses.selectAll);
  readonly query$ = this.store.select(fromServiceOfferings.filterQuery);
  readonly selectedClasses$ = this.store.select(fromServiceOfferings.filterSelectedClasses);
  readonly viewMode$ = this.store.select(fromServiceOfferings.filterSelectedViewMode);

  public formMode = ServiceOfferingFromMode.SELECT;

  public serviceOffering: ServiceOffering;
  public customOfferingRestrictions: ICustomOfferingRestrictions;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<VmCreationServiceOfferingContainerComponent>,
    private store: Store<State>,
    private cd: ChangeDetectorRef
  ) {
    this.serviceOffering = data.serviceOffering;
    this.customOfferingRestrictions = data.restriction;
  }

  ngOnInit() {
    this.store.dispatch(new serviceOfferingActions.ServiceOfferingsFilterUpdate(fromServiceOfferings.initialFilters));
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
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
