import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { State } from '../../reducers/index';
// tslint:disable-next-line
import { CustomServiceOfferingService, } from '../../service-offering/custom-service-offering/service/custom-service-offering.service';
import { Account } from '../../shared/models/account.model';
import { AuthService } from '../../shared/services/auth.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { VirtualMachine, VmState } from '../shared/vm.model';

import * as fromAuths from '../../reducers/auth/redux/auth.reducers';
import * as serviceOfferingActions from '../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../reducers/service-offerings/redux/service-offerings.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as zoneActions from '../../reducers/zones/redux/zones.actions';
import * as domainActions from '../../reducers/domains/redux/domains.actions';

@Component({
  selector: 'cs-service-offering-dialog-container',
  template: `
    <cs-service-offering-dialog
      [serviceOfferings]="offerings$ | async"
      [isVmRunning]="isVmRunning()"
      [virtualMachine]="virtualMachine"
      [serviceOfferingId]="virtualMachine.serviceOfferingId"
      [restrictions]="restrictions$ | async"
      [resourceUsage]="resourceUsage$ | async"
      (onServiceOfferingChange)="changeServiceOffering($event)"
    >
    </cs-service-offering-dialog>`,
})
export class ServiceOfferingDialogContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly offerings$ = this.store.select(fromServiceOfferings.getAvailableOfferings);
  readonly user$ = this.store.select(fromAuths.getUserAccount);
  readonly restrictions$ = this.store.select(fromServiceOfferings.getCustomRestrictions);
  readonly resourceUsage$ = this.store.select(fromAuths.getUserAvailableResources);

  public virtualMachine: VirtualMachine;
  public user: Account;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogService: DialogService,
    public dialogRef: MatDialogRef<ServiceOfferingDialogContainerComponent>,
    private customServiceOfferingService: CustomServiceOfferingService,
    private store: Store<State>,
    private auth: AuthService
  ) {
    super();
    this.virtualMachine = data.vm;
    this.user$
      .takeUntil(this.unsubscribe$)
      .subscribe((user) => {
        if (user) {
          this.user = user;
        }
      });
  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadSelectedZone(this.virtualMachine.zoneId));
    this.store.dispatch(new serviceOfferingActions.LoadOfferingAvailabilityRequest());
    this.store.dispatch(new serviceOfferingActions.LoadDefaultParamsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadCustomRestrictionsRequest());
    if (this.auth.isAdmin()) {
      this.store.dispatch(new domainActions.LoadDomainsRequest());
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
