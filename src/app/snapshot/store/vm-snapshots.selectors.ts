import { createSelector } from '@ngrx/store';
import * as moment from 'moment';
import * as vmSelectors from '../../reducers/vm/redux/vm.reducers';
import { vmSnapshotsSelectors } from '../../root-store';
import { VirtualMachine, VmState } from '../../vm';
import { VmSnapshotViewModel } from '../models/vm-snapshot.view-model';

export const getVmSnapshots = createSelector(
  vmSnapshotsSelectors.selectAll,
  vmSelectors.selectEntities,
  (snapshots, vmEntities): VmSnapshotViewModel[] => {
    if (snapshots.length === 0) {
      return [];
    }

    return snapshots.map(snapshot => {
      const vm: VirtualMachine = vmEntities[snapshot.virtualmachineid];
      const vmName: string = vm ? vm.displayname : '';
      const vmState: VmState = vm ? vm.state : undefined;
      const viewModel: VmSnapshotViewModel = {
        vmName,
        vmState,
        id: snapshot.id,
        state: snapshot.state,
        name: snapshot.displayname,
        created: moment(snapshot.created).toDate(),
      };
      return viewModel;
    });
  },
);
