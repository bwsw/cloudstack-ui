import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import * as accountTagsActions from '../../reducers/account-tags/redux/account-tags.actions';
import { State } from '../../reducers';
// tslint:disable-next-line
import { Account, accountResourceType } from '../../shared/models/account.model';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { configSelectors, UserTagsActions } from '../../root-store';
import * as serviceOfferingActions from '../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../reducers/service-offerings/redux/service-offerings.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as zoneActions from '../../reducers/zones/redux/zones.actions';
import { selectFilteredOfferings } from '../selectors';

@Component({
  selector: 'cs-service-offering-dialog-container',
  template: `
    <cs-service-offering-dialog
      [serviceOfferings]="offerings$ | async"
      [classes]="classes$ | async"
      [selectedClasses]="selectedClasses$ | async"
      [viewMode]="viewMode$ | async"
      [query]="query$ | async"
      [isVmRunning]="isVmRunning()"
      [virtualMachine]="virtualMachine"
      [serviceOfferingId]="virtualMachine.serviceofferingid"
      (serviceOfferingChanged)="changeServiceOffering($event)"
      (serviceOfferingUpdated)="updateServiceOffering($event)"
      (viewModeChanged)="onViewModeChange($event)"
      (selectedClassesChanged)="onSelectedClassesChange($event)"
      (queryChange)="onQueryChange($event)"
    >
    </cs-service-offering-dialog>`,
})
export class ServiceOfferingDialogContainerComponent implements OnInit, AfterViewInit {
  readonly offerings$ = this.store.pipe(select(selectFilteredOfferings));
  readonly query$ = this.store.pipe(select(fromServiceOfferings.filterQuery));
  readonly classes$ = this.store.pipe(select(configSelectors.get('computeOfferingClasses')));
  readonly selectedClasses$ = this.store.pipe(select(fromServiceOfferings.filterSelectedClasses));
  readonly viewMode$ = this.store.pipe(select(fromServiceOfferings.filterSelectedViewMode));

  public virtualMachine: VirtualMachine;
  public user: Account;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogService: DialogService,
    public dialogRef: MatDialogRef<ServiceOfferingDialogContainerComponent>,
    private store: Store<State>,
    private cd: ChangeDetectorRef,
  ) {
    this.virtualMachine = data.vm;
  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadSelectedZone(this.virtualMachine.zoneid));
    this.store.dispatch(
      new serviceOfferingActions.ServiceOfferingsFilterUpdate(fromServiceOfferings.initialFilters),
    );
    this.store.dispatch(
      new accountTagsActions.LoadAccountTagsRequest({ resourcetype: accountResourceType }),
    );
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
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

  public updateServiceOffering(offering) {
    if (offering.iscustomized) {
      this.store.dispatch(new UserTagsActions.UpdateCustomServiceOfferingParams({ offering }));
    }
  }

  public changeServiceOffering(serviceOffering) {
    this.store.dispatch(
      new vmActions.ChangeServiceOffering({
        vm: this.virtualMachine,
        offering: serviceOffering,
      }),
    );
    this.dialogRef.close();
  }

  public isVmRunning(): boolean {
    return this.virtualMachine.state === VmState.Running;
  }
}
