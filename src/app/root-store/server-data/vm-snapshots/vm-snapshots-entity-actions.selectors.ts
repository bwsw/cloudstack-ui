import { createSelector } from '@ngrx/store';
import * as vmSelectors from '../../../reducers/vm/redux/vm.reducers';
import { EntityAction, NgrxEntities } from '../../../shared/interfaces';
import { VmState } from '../../../vm/shared/vm.model';
import * as vmSnapshotsActions from './vm-snapshots.actions';
import * as vmSnapshotsSelectors from './vm-snapshots.selectors';

/**
 * return a Dictionary of EntityActions for VM snapshots
 * naming in accordance with the NGRX selector (selectEntities)
 */
export const getVmSnapshotEntityActionsEntities = createSelector(
  vmSnapshotsSelectors.selectAll,
  vmSelectors.selectEntities,
  (vmSnapshots, virtualMachineEntities): NgrxEntities<EntityAction[]> => {
    return vmSnapshots.reduce((dictionary, vmSnapshot) => {
      const vm = virtualMachineEntities[vmSnapshot.virtualmachineid];
      const vmState = vm ? vm.state : undefined;
      dictionary[vmSnapshot.id] = [
        {
          icon: 'mdi-camera',
          text: 'SNAPSHOT_PAGE.ACTIONS.CREATE_SNAP_FROM_VM_SNAP',
          disabled: false,
          visible: false,
          actionCreator: () =>
            new vmSnapshotsActions.CreateVolumeSnapshot({ snapshotId: vmSnapshot.id }),
        },
        {
          icon: 'mdi-backup-restore',
          text: 'SNAPSHOT_PAGE.ACTIONS.REVERT_VM_TO_SNAPSHOT',
          disabled: vmState !== VmState.Running,
          visible: true,
          actionCreator: () => new vmSnapshotsActions.Revert({ id: vmSnapshot.id }),
        },
        {
          icon: 'mdi-delete',
          text: 'COMMON.DELETE',
          disabled: false,
          visible: true,
          actionCreator: () => new vmSnapshotsActions.Delete({ id: vmSnapshot.id }),
        },
      ];
      return dictionary;
    }, {});
  },
);

export const getVmSnapshotEntityActions = (vmSnapshotId: string) =>
  createSelector(
    getVmSnapshotEntityActionsEntities,
    actionsEntities => actionsEntities[vmSnapshotId] || [],
  );
