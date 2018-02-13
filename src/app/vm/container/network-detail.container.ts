import { Component } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import { IpAddress } from '../../shared/models/ip-address.model';

@Component({
  selector: 'cs-storage-details-container',
  template: `
    <cs-nic-list
      [vm]="vm$ | async"
      (onSecondaryIpAdd)="addSecondaryIp($event)"
      (onSecondaryIpRemove)="removeSecondaryIp($event)"
    ></cs-nic-list>
    <cs-firewall-rules-detail-container
      [vm]="vm$ | async"
    ></cs-firewall-rules-detail-container>
  `
})
export class NetworkDetailContainerComponent {

  readonly vm$ = this.store.select(fromVMs.getSelectedVM);

  constructor(
    private store: Store<State>,
  ) {
  }

  public addSecondaryIp(nicId: string) {
    this.vm$.take(1).subscribe(vm => {
      this.store.dispatch(new vmActions.AddSecondaryIp({
        vm,
        nicId
      }));
    });
  }

  public removeSecondaryIp(secondaryIp: IpAddress) {
    this.vm$.take(1).subscribe(vm => {
      this.store.dispatch(new vmActions.RemoveSecondaryIp({
        vm,
        id: secondaryIp.id
      }));
    });
  }

}
