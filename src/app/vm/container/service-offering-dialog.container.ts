import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import * as fromAuths from '../../reducers/auth/redux/auth.reducers';
import { State } from '../../reducers/index';
import * as soGroupActions from '../../reducers/service-offerings/redux/service-offering-class.actions';
import * as fromSOClasses from '../../reducers/service-offerings/redux/service-offering-class.reducers';

import * as serviceOfferingActions from '../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../reducers/service-offerings/redux/service-offerings.reducers';
import * as fromUserTags from '../../reducers/user-tags/redux/user-tags.reducers';
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
      [classes]="classes$ | async"
      [classTags]="classTags$ | async"
      [viewMode]="viewMode$ | async"
      [query]="query$ | async"
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
export class ServiceOfferingDialogContainerComponent implements OnInit {
  readonly offerings$ = this.store.select(fromServiceOfferings.selectFilteredOfferings);
  readonly customOfferingRestrictions$ = this.store.select(fromServiceOfferings.getCustomRestrictions);
  readonly query$ = this.store.select(fromServiceOfferings.filterQuery);
  readonly defaultParams$ = this.store.select(fromServiceOfferings.getDefaultParams);
  readonly classes$ = this.store.select(fromSOClasses.selectAll);
  readonly classTags$ = this.store.select(fromUserTags.selectServiceOfferingClassTags);
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
    this.store.dispatch(new soGroupActions.LoadServiceOfferingClassRequest());
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
    this.store.dispatch(new vmActions.ChangeServiceOffering({
      vm: this.virtualMachine,
      offering: serviceOffering
    }));
    this.dialogRef.close();
  }
}
