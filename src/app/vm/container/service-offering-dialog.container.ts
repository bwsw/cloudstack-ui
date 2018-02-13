import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import * as accountTagsActions from '../../reducers/account-tags/redux/account-tags.actions';
import { State } from '../../reducers/index';
import * as soGroupActions from '../../reducers/service-offerings/redux/service-offering-class.actions';
import * as fromSOClasses from '../../reducers/service-offerings/redux/service-offering-class.reducers';

import * as serviceOfferingActions from '../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../reducers/service-offerings/redux/service-offerings.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as zoneActions from '../../reducers/zones/redux/zones.actions';
// tslint:disable-next-line
import { Account, AccountResourceType } from '../../shared/models/account.model';
import { VirtualMachine, VmState } from '../shared/vm.model';

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
      [serviceOfferingId]="virtualMachine.serviceOfferingId"
      [restrictions]="customOfferingRestrictions$ | async"
      [defaultParams]="defaultParams$ | async"
      (onServiceOfferingChange)="changeServiceOffering($event)"
      (onServiceOfferingUpdate)="updateServiceOffering($event)"
      (viewModeChange)="onViewModeChange($event)"
      (selectedClassesChange)="onSelectedClassesChange($event)"
      (queryChange)="onQueryChange($event)"
    >
    </cs-service-offering-dialog>`,
})
export class ServiceOfferingDialogContainerComponent implements OnInit, AfterViewInit {
  readonly offerings$ = this.store.select(fromServiceOfferings.selectFilteredOfferings);
  readonly customOfferingRestrictions$ = this.store.select(fromServiceOfferings.getCustomRestrictions);
  readonly query$ = this.store.select(fromServiceOfferings.filterQuery);
  readonly defaultParams$ = this.store.select(fromServiceOfferings.getDefaultParams);
  readonly classes$ = this.store.select(fromSOClasses.selectAll);
  readonly selectedClasses$ = this.store.select(fromServiceOfferings.filterSelectedClasses);
  readonly viewMode$ = this.store.select(fromServiceOfferings.filterSelectedViewMode);

  public virtualMachine: VirtualMachine;
  public user: Account;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogService: DialogService,
    public dialogRef: MatDialogRef<ServiceOfferingDialogContainerComponent>,
    private store: Store<State>,
    private cd: ChangeDetectorRef
  ) {
    this.virtualMachine = data.vm;
  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadSelectedZone(this.virtualMachine.zoneId));
    this.store.dispatch(new serviceOfferingActions.LoadOfferingAvailabilityRequest());
    this.store.dispatch(new serviceOfferingActions.LoadDefaultParamsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadCustomRestrictionsRequest());
    this.store.dispatch(new serviceOfferingActions.ServiceOfferingsFilterUpdate(fromServiceOfferings.initialFilters));
    this.store.dispatch(new soGroupActions.LoadServiceOfferingClassRequest());
    this.store.dispatch(new accountTagsActions.LoadAccountTagsRequest({ resourcetype: AccountResourceType }));
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
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
    if (serviceOffering.iscustomized) {
      this.store.dispatch(new serviceOfferingActions.UpdateCustomServiceOffering(serviceOffering));
    }
  }

  public changeServiceOffering(serviceOffering) {
    this.store.dispatch(new vmActions.ChangeServiceOffering({
      vm: this.virtualMachine,
      offering: serviceOffering
    }));
    this.dialogRef.close();
  }

  public isVmRunning(): boolean {
    return this.virtualMachine.state === VmState.Running;
  }
}
