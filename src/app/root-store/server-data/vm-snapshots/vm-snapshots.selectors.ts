import { createFeatureSelector, createSelector } from '@ngrx/store';
import { vmSnapshotsFeatureName } from './vm-snapshots.reducer';
import { VmSnapshotsState, adapter } from './vm-snapshots.state';

const getVmSnapshotState = createFeatureSelector<VmSnapshotsState>(vmSnapshotsFeatureName);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getVmSnapshotState,
);

export const getIsLoading = createSelector(getVmSnapshotState, state => state.isLoading);
