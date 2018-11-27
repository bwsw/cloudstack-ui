import { VmSnapshotActionsUnion, VmSnapshotActionTypes } from './vm-snapshots.actions';
import { adapter, initialState, VmSnapshotsState } from './vm-snapshots.state';

export const vmSnapshotsFeatureName = 'vmSnapshots';

export function reducer(state = initialState, action: VmSnapshotActionsUnion): VmSnapshotsState {
  switch (action.type) {
    case VmSnapshotActionTypes.Load: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case VmSnapshotActionTypes.LoadSuccess: {
      return adapter.addAll(action.payload.snapshots, { ...state, isLoading: false });
    }

    case VmSnapshotActionTypes.LoadError: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case VmSnapshotActionTypes.DeleteSuccess: {
      return adapter.removeOne(action.payload.id, state);
    }

    default: {
      return state;
    }
  }
}
