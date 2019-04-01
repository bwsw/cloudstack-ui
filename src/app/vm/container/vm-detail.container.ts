import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { filter, first, map, switchMap, take } from 'rxjs/operators';
import * as fromAffinityGroupsActions from '../../reducers/affinity-groups/redux/affinity-groups.actions';
import * as fromAffinityGroups from '../../reducers/affinity-groups/redux/affinity-groups.reducers';
import * as serviceOfferingActions from '../../reducers/service-offerings/redux/service-offerings.actions';
import * as fromServiceOfferings from '../../reducers/service-offerings/redux/service-offerings.reducers';
import * as sshKeyActions from '../../reducers/ssh-keys/redux/ssh-key.actions';
import * as fromSshKeys from '../../reducers/ssh-keys/redux/ssh-key.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import { State, vmSnapshotsActions, vmSnapshotsSelectors } from '../../root-store';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { VmSnapshotListDialogComponent } from '../components/vm-snapshot-list-dialog/vm-snapshot-list-dialog.component';
import { VirtualMachine } from '../shared/vm.model';
import { areOfferingsAvailable } from '../selectors';
import * as zoneActions from '../../reducers/zones/redux/zones.actions';

const vmDescriptionKey = 'csui.vm.description';

@Component({
  selector: 'cs-vm-details-container',
  template: `
    <cs-description
      [description]="description$ | async"
      (descriptionChange)="changeDescription($event)"
    >
    </cs-description>
    <cs-vm-detail [vm]="vm$ | async"></cs-vm-detail>
    <cs-instance-group
      [vm]="vm$ | async"
      [groups]="groups$ | async"
      (groupChanged)="changeGroup($event)"
    >
    </cs-instance-group>
    <cs-service-offering-details
      [offering]="offering$ | async"
      [areOfferingsAvailable]="areOfferingsAvailable$ | async"
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
    <cs-statistics [vm]="vm$ | async" (statsUpdated)="updateStats($event)"></cs-statistics>
    <cs-vm-snapshots-sidebar-card
      [lastVmSnapshot]="lastVmSnapshot$ | async"
      [vmSnapshotsCount]="vmSnapshotsCount$ | async"
      [entityActions]="lastVmSnapshotActions$ | async"
      (createButtonClicked)="onCreateVmSnapshot()"
      (showAllVMSnapshotsButtonClicked)="onShowAllVmSnapshots()"
    ></cs-vm-snapshots-sidebar-card>
  `,
})
export class VmDetailContainerComponent implements OnInit {
  readonly vm$ = this.store.pipe(select(fromVMs.getSelectedVM));
  readonly selectedVMId = this.store.pipe(select(fromVMs.getSelectedId));
  readonly groups$ = this.store.pipe(select(fromVMs.selectVmGroups));
  readonly offering$ = this.store.pipe(select(fromServiceOfferings.getSelectedOffering));
  readonly areOfferingsAvailable$ = this.store.pipe(select(areOfferingsAvailable));
  readonly sshKeys$ = this.store.pipe(select(fromSshKeys.selectSSHKeys));
  readonly description$ = this.vm$.pipe(
    filter(vm => !!vm),
    map((vm: VirtualMachine) => {
      const descriptionTag = vm.tags.find(tag => tag.key === vmDescriptionKey);
      return descriptionTag && descriptionTag.value;
    }),
  );
  readonly affinityGroups$ = this.store.pipe(select(fromAffinityGroups.selectAll));
  readonly vmSnapshots$ = this.store.pipe(select(vmSnapshotsSelectors.getVmSnapshotsForSelectedVm));
  readonly lastVmSnapshot$ = this.vmSnapshots$.pipe(map(vmSnapshots => vmSnapshots[0]));
  readonly lastVmSnapshotActions$ = this.lastVmSnapshot$.pipe(
    filter(snapshot => !!snapshot),
    switchMap(snapshot =>
      this.store.pipe(select(vmSnapshotsSelectors.getVmSnapshotEntityActions(snapshot.id))),
    ),
  );
  readonly vmSnapshotsCount$ = this.vmSnapshots$.pipe(map(vmSnapshots => vmSnapshots.length));

  constructor(private store: Store<State>, public dialog: MatDialog) {}

  public changeDescription(description) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      this.store.dispatch(new vmActions.ChangeDescription({ vm, description }));
    });
  }

  public changeGroup(group: string) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      if (group !== '') {
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

  public onCreateVmSnapshot() {
    this.vm$
      .pipe(
        first(),
        map(vm => vm.id),
      )
      .subscribe(vmId => this.store.dispatch(new vmSnapshotsActions.Create({ vmId })));
  }

  public onShowAllVmSnapshots() {
    this.dialog.open(VmSnapshotListDialogComponent, { width: '800px' });
  }

  public updateStats(vm) {
    this.store.dispatch(new vmActions.LoadVMRequest({ id: vm.id }));
  }

  public ngOnInit() {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      if (vm) {
        this.store.dispatch(new zoneActions.LoadSelectedZone(vm.zoneid));
      }
    });
    this.store.dispatch(new sshKeyActions.LoadSshKeyRequest());
    this.store.dispatch(new fromAffinityGroupsActions.LoadAffinityGroupsRequest());
    this.store.dispatch(new vmSnapshotsActions.Load());
    this.store.dispatch(
      new serviceOfferingActions.ServiceOfferingsFilterUpdate(fromServiceOfferings.initialFilters),
    );
    this.store.dispatch(new serviceOfferingActions.LoadOfferingsRequest());
    this.selectedVMId.pipe(take(1)).subscribe((id: string) => {
      this.store.dispatch(new vmActions.LoadVMUserDataRequest(id));
    });
  }
}
