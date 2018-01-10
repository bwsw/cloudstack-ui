import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import * as fromAuths from '../../reducers/auth/redux/auth.reducers';
import { State } from '../../reducers/index';
import * as soGroupActions from '../../reducers/service-offerings/redux/service-offering-group.actions';
import * as fromSOGroups from '../../reducers/service-offerings/redux/service-offering-group.reducers';

import * as serviceOfferingActions from '../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../reducers/service-offerings/redux/service-offerings.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as zoneActions from '../../reducers/zones/redux/zones.actions';
// tslint:disable-next-line
import { CustomServiceOfferingService, } from '../../service-offering/custom-service-offering/service/custom-service-offering.service';
import { Account } from '../../shared/models/account.model';
import { VirtualMachine } from '../shared/vm.model';

@Component({
  selector: 'cs-service-offering-dialog-container',
  template: `
    <cs-service-offering-dialog
      [serviceOfferings]="offerings$ | async"
      [groups]="groups$ | async"
      [viewMode]="viewMode$ | async"
      [serviceOfferingId]="virtualMachine.serviceOfferingId"
      [restrictions]="customOfferingRestrictions$ | async"
      (onServiceOfferingChange)="changeServiceOffering($event)"
      (onServiceOfferingUpdate)="updateServiceOffering($event)"
      (viewModeChange)="onViewModeChange($event)"
      (selectedGroupsChange)="onSelectedGroupsChange($event)"
      (queryChange)="onQueryChange($event)"
    >
    </cs-service-offering-dialog>`,
})
export class ServiceOfferingDialogContainerComponent implements OnInit {
  readonly offerings$ = this.store.select(fromServiceOfferings.selectFilteredOfferings);
  readonly customOfferingRestrictions$ = this.store.select(fromServiceOfferings.getCustomRestrictionsForVmCreation);
  readonly groups$ = this.store.select(fromSOGroups.selectAll);
  readonly viewMode$ = this.store.select(fromServiceOfferings.filterSelectedViewMode);

  readonly user$ = this.store.select(fromAuths.getUserAccount);

  public virtualMachine: VirtualMachine;
  public user: Account;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogService: DialogService,
    public dialogRef: MatDialogRef<ServiceOfferingDialogContainerComponent>,
    private customServiceOfferingService: CustomServiceOfferingService,
    private store: Store<State>,
  ) {
    this.virtualMachine = data.vm;
  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadSelectedZone(this.virtualMachine.zoneId));
    this.store.dispatch(new serviceOfferingActions.LoadOfferingAvailabilityRequest());
    this.store.dispatch(new serviceOfferingActions.LoadDefaultParamsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadCustomRestrictionsRequest());
    this.store.dispatch(new soGroupActions.LoadServiceOfferingGroupRequest());
  }

  public onViewModeChange(selectedViewMode: string) {
    this.store.dispatch(new serviceOfferingActions.ServiceOfferingsFilterUpdate({ selectedViewMode }));
  }

  public onSelectedGroupsChange(selectedGroups: string[]) {
    this.store.dispatch(new serviceOfferingActions.ServiceOfferingsFilterUpdate({ selectedGroups }));
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new serviceOfferingActions.ServiceOfferingsFilterUpdate({ query }));
  }

  public updateServiceOffering(serviceOffering) {
    this.store.dispatch(new serviceOfferingActions.UpdateCustomServiceOffering(serviceOffering));
  }

  public changeServiceOffering(serviceOffering) {
    this.store.dispatch(new vmActions.ChangeServiceOffering({
      vm: this.virtualMachine,
      offering: serviceOffering
    }));
    this.dialogRef.close();
  }
}
