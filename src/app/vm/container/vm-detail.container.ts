import { filter, map, take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { State } from '../../reducers';
import * as serviceOfferingActions from '../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../reducers/service-offerings/redux/service-offerings.reducers';
import * as sshKeyActions from '../../reducers/ssh-keys/redux/ssh-key.actions';
import * as fromSshKeys from '../../reducers/ssh-keys/redux/ssh-key.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromAffinityGroups from '../../reducers/affinity-groups/redux/affinity-groups.reducers';
import * as fromAffinityGroupsActions from '../../reducers/affinity-groups/redux/affinity-groups.actions';
import { VirtualMachine } from '../shared/vm.model';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';

const vmDescriptionKey = 'csui.vm.description';

@Component({
  selector: 'cs-vm-details-container',
  template: `
    <cs-description
      [description]="description$ | async"
      (descriptionChange)="changeDescription($event)"
    >
    </cs-description>
    <cs-zone [vm]="vm$ | async"></cs-zone>
    <cs-instance-group
      [vm]="vm$ | async"
      [groups]="groups$ | async"
      (groupChanged)="changeGroup($event)"
    >
    </cs-instance-group>
    <cs-service-offering-details
      [offering]="offering$ | async"
      [vm]="vm$ | async"
    >
    </cs-service-offering-details>
    <cs-affinity-group
      [vm]="vm$ | async"
      [affinityGroups]="affinityGroups$ | async"
      (affinityGroupRemoved)="removeAffinityGroup($event)"
      (affinityGroupChanged)="changeAffinityGroup($event)"
    >
    </cs-affinity-group>
    <cs-vm-detail-template [vm]="vm$ | async"></cs-vm-detail-template>
    <cs-vm-ssh-keypair
      [vm]="vm$ | async"
      [keys]="sshKeys$ | async"
      (sshKeyChanged)="changeSshKey($event)"
    >
    </cs-vm-ssh-keypair>
    <cs-statistics
      [vm]="vm$ | async"
      (statsUpdated)="updateStats($event)"
    ></cs-statistics>
  `,
})
export class VmDetailContainerComponent implements OnInit {
  readonly vm$ = this.store.pipe(select(fromVMs.getSelectedVM));
  readonly groups$ = this.store.pipe(select(fromVMs.selectVmGroups));
  readonly offering$ = this.store.pipe(select(fromServiceOfferings.getSelectedOffering));
  readonly sshKeys$ = this.store.pipe(select(fromSshKeys.selectSSHKeys));
  readonly description$ = this.vm$.pipe(
    filter(vm => !!vm),
    map((vm: VirtualMachine) => {
      const descriptionTag = vm.tags.find(tag => tag.key === vmDescriptionKey);
      return descriptionTag && descriptionTag.value;
    }),
  );
  readonly affinityGroups$ = this.store.pipe(select(fromAffinityGroups.selectAll));

  constructor(private store: Store<State>) {}

  public changeDescription(description) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      this.store.dispatch(new vmActions.ChangeDescription({ vm, description }));
    });
  }

  public changeGroup(group) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      if (group.name !== '') {
        this.store.dispatch(
          new vmActions.ChangeInstanceGroup({
            vm,
            group,
          }),
        );
      } else {
        this.store.dispatch(new vmActions.RemoveInstanceGroup(vm));
      }
    });
  }

  public changeAffinityGroup(affinityGroupIds: string[]) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      this.store.dispatch(
        new vmActions.ChangeAffinityGroup({
          vm,
          affinityGroupIds,
        }),
      );
    });
  }

  public removeAffinityGroup(affinityGroupId: string) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      const affinityGroupIds = vm.affinitygroup
        .map(g => g.id)
        .filter(groupId => groupId !== affinityGroupId);
      this.store.dispatch(
        new vmActions.ChangeAffinityGroup({
          vm,
          affinityGroupIds,
        }),
      );
    });
  }

  public changeSshKey(keyPair: SSHKeyPair) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      this.store.dispatch(
        new vmActions.ChangeSshKey({
          vm,
          keyPair,
        }),
      );
    });
  }

  public updateStats(vm) {
    this.store.dispatch(new vmActions.LoadVMRequest({ id: vm.id }));
  }

  public ngOnInit() {
    this.store.dispatch(new serviceOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(new sshKeyActions.LoadSshKeyRequest());
    this.store.dispatch(new fromAffinityGroupsActions.LoadAffinityGroupsRequest());
  }
}
