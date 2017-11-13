import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as serviceOfferingActions from '../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromServiceOfferings from '../../reducers/service-offerings/redux/service-offerings.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { VirtualMachine } from '../shared/vm.model';

const vmDescriptionKey = 'csui.vm.description';

@Component({
  selector: 'cs-vm-details-container',
  template: `
    <cs-description
      [description]="description"
      (descriptionChange)="changeDescription($event)"
    ></cs-description>
    <cs-zone [vm]="vm$ | async"></cs-zone>
    <cs-instance-group [vm]="vm$ | async"></cs-instance-group>
    <cs-service-offering-details 
      [offering]="offering$ | async"
      (onOfferingChange)="changeOffering($event)">      
    </cs-service-offering-details>
    <cs-affinity-group 
      [vm]="vm$ | async" 
      (onAffinityGroupChange)="changeAffinityGroup($event)">
    </cs-affinity-group>
    <cs-vm-detail-template [vm]="vm$ | async"></cs-vm-detail-template>
    <cs-vm-ssh-keypair 
      [vm]="vm$ | async" 
      (onSshKeyChange)="changeSshKey($event)"
      (onVirtualMachineStop)="stopVirtualMachine($event)"
    ></cs-vm-ssh-keypair>
    <cs-statistics [vm]="vm$ | async" (onStatsUpdate)="updateStats($event)"></cs-statistics>
  `
})
export class VmDetailContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly vm$ = this.store.select(fromVMs.getSelectedVM);
  readonly offering$ = this.store.select(fromServiceOfferings.getSelectedOffering);
  public description;

  public vm: VirtualMachine;


  constructor(
    private store: Store<State>,
  ) {
    super();
  }

  public changeDescription(description) {
    let v = Object.assign({}, this.vm);
    this.store.dispatch(new vmActions.ChangeDescription({ vm: v, description }));
  }

  public changeOffering(offering) {
    let vm = Object.assign({}, this.vm, { offering });
    this.store.dispatch(new vmActions.UpdateVM(vm));
  }

  public changeAffinityGroup(vm) {
    this.store.dispatch(new vmActions.UpdateVM(vm));
  }

  public changeSshKey(vm) {
    this.store.dispatch(new vmActions.UpdateVM(vm));
  }

  public stopVirtualMachine(vm) {
    //this.store.dispatch(new vmActions.StopVm(vm));
  }

  public updateStats(vm) {
    this.store.dispatch(new vmActions.LoadVMRequest({ id: vm.id }));
  }

  public ngOnInit() {
    this.store.dispatch(new serviceOfferingActions.LoadOfferingsRequest());
    this.vm$
      .takeUntil(this.unsubscribe$)
      .subscribe(vm => {
        if (vm) {
          this.vm = new VirtualMachine(vm);
          const descriptionTag = this.vm.tags.find(tag => tag.key === vmDescriptionKey);
          this.description = descriptionTag && descriptionTag.value;
        }
      })
  }

}
