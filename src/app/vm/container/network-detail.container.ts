import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as zoneActions from '../../reducers/zones/redux/zones.actions';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromZones from '../../reducers/zones/redux/zones.reducers'
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { VirtualMachine } from '../shared/vm.model';

@Component({
  selector: 'cs-storage-details-container',
  template: `
    <cs-nic-list 
      [vm]="vm$ | async"
      (onSecondaryIpAdd)="addSecondaryIp($event)"
      (onSecondaryIpRemove)="removeSecondaryIp($event)"
    ></cs-nic-list>
    <cs-firewall-rules-detail
      [vm]="vm$ | async"
    ></cs-firewall-rules-detail>
  `
})
export class NetworkDetailContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly vm$ = this.store.select(fromVMs.getSelectedVM);
  readonly zone$ = this.store.select(fromZones.getSelectedZone);

  public vm: VirtualMachine;


  constructor(
    private store: Store<State>,
  ) {
    super();
  }

  public addSecondaryIp(nicId) {
    this.store.dispatch(new vmActions.AddSecondaryIp({
      vm: this.vm,
      nicId
    }));
  }

  public removeSecondaryIp(secondaryIp) {
    this.store.dispatch(new vmActions.RemoveSecondaryIp({
      vm: this.vm,
      id: secondaryIp.id
    }));
  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadZonesRequest());
    this.vm$
      .takeUntil(this.unsubscribe$)
      .subscribe(vm => {
        if (vm) {
          this.vm = new VirtualMachine(vm);
          this.store.dispatch(new zoneActions.LoadSelectedZone(this.vm.zoneId));
        }
      });
  }

}
