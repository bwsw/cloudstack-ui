import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as vmSelectors from '../../../reducers/vm/redux/vm.reducers';
import { vmSnapshotsFeatureName } from './vm-snapshots.reducer';
import { adapter, VmSnapshotsState } from './vm-snapshots.state';

const getVmSnapshotState = createFeatureSelector<VmSnapshotsState>(vmSnapshotsFeatureName);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getVmSnapshotState,
);

export const getIsLoading = createSelector(
  getVmSnapshotState,
  state => state.isLoading,
);

export const getVmSnapshotsForSelectedVm = createSelector(
  selectAll,
  vmSelectors.getSelectedId,
  (vmSnapshots, selectedVmId) =>
    vmSnapshots.filter(snapshot => snapshot.virtualmachineid === selectedVmId),
);
