import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers';
import { ServiceOffering } from '../../../shared/models';

import * as fromSO from '../../../reducers/service-offerings/redux/service-offerings.reducers';
import * as fromVM from '../../../reducers/vm/redux/vm.reducers';

@Component({
  selector: 'cs-service-offering-selector-container',
  template: `
    <cs-service-offering-selector
      name="serviceOffering"
      [isLoading]="isLoading$ | async"
      [serviceOfferings]="serviceOfferings$ | async"
      [customOfferingRestrictions]="customOfferingRestrictions$ | async"
      [zoneId]="zoneId$ | async"
      [ngModel]="serviceOffering"
      (change)="serviceOfferingChange.emit($event)"
    ></cs-service-offering-selector>`
})
export class ServiceOfferingSelectorContainerComponent {
  readonly isLoading$ = this.store.select(fromSO.isLoading);
  readonly serviceOfferings$ = this.store.select(fromSO.getAvailableOfferingsForVmCreation);
  readonly customOfferingRestrictions$ = this.store.select(fromSO.customOfferingRestrictions);
  readonly zoneId$ = this.store.select(fromVM.getVmCreationZoneId);
  @Input() public serviceOffering: ServiceOffering;
  @Output() public serviceOfferingChange = new EventEmitter<ServiceOffering>();

  constructor(private store: Store<State>) {
  }
}
