import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as moment from 'moment';
import * as volumeSnapshotsSelectors from '../../reducers/snapshots/redux/snapshot.reducers';
import * as vmSelectors from '../../reducers/vm/redux/vm.reducers';
import { vmSnapshotsSelectors } from '../../root-store/server-data/vm-snapshots';
import { getSnapshotDescription, Snapshot } from '../../shared/models';
import { getSnapshotType, VmSnapshot } from '../../shared/models/vm-snapshot.model';
import { SnapshotType } from '../../shared/types';
import { VirtualMachine, VmState } from '../../vm';
import { Filters } from '../models/filters.model';
import { VmSnapshotSidebarViewModel } from '../models/vm-snapshot-sidebar.view-model';
import { VmSnapshotViewModel } from '../models/vm-snapshot.view-model';
import { SnapshotPageState, snapshotPageStoreName } from './snapshot-page.reducer';

const getSnapshotPageState = createFeatureSelector<SnapshotPageState>(snapshotPageStoreName);

const getSelectedId = createSelector(getSnapshotPageState, state => state.selectedId);

export const getViewMode = createSelector(getSnapshotPageState, state => state.viewMode);

export const getFilters = createSelector(getSnapshotPageState, (state): Filters => state.filters);

export const getGroupings = createSelector(getSnapshotPageState, state => state.groupings);

export const getSelectedSnapshot = createSelector(
  getSelectedId,
  vmSnapshotsSelectors.selectAll,
  volumeSnapshotsSelectors.selectAll,
  (selectedId, vmSnapsots, volumeSnapshots): Snapshot | VmSnapshot => {
    const volumeSnapshot = volumeSnapshots.find(snap => snap.id === selectedId);
    if (volumeSnapshot != null) {
      return volumeSnapshot;
    }

    return vmSnapsots.find(snap => snap.id === selectedId);
  },
);

export const getSelectedSnapshotForSidebar = createSelector(
  getSelectedSnapshot,
  vmSelectors.selectEntities,
  (snapshot, vmEntities): Snapshot | VmSnapshotSidebarViewModel => {
    if (getSnapshotType(snapshot) === SnapshotType.VM) {
      const vmSnapshot: VmSnapshot = snapshot as VmSnapshot;
      const viewModel: VmSnapshotSidebarViewModel = {
        id: vmSnapshot.id,
        state: vmSnapshot.state,
        name: vmSnapshot.displayname,
        description: vmSnapshot.description,
        vmId: vmSnapshot.virtualmachineid,
        vmName: vmEntities[vmSnapshot.virtualmachineid].displayname,
        vmState: vmEntities[vmSnapshot.virtualmachineid].state,
        created: moment(vmSnapshot.created).toDate(),
        type: vmSnapshot.type,
        current: vmSnapshot.current,
        parentName: vmSnapshot.parentName,
      };
      return viewModel;
    }

    return snapshot as Snapshot;
  },
);

const getFilteredVmSnapshots = createSelector(
  vmSnapshotsSelectors.selectAll,
  getFilters,
  (snapshots, filters) => {
    const filterByAccounts = (snapshot: VmSnapshot) => {
      const filterEnabled = filters.accounts.length > 0;
      if (!filterEnabled) {
        return true;
      }
      return filters.accounts.findIndex(account => account === snapshot.account) >= 0;
    };

    const filterByDate = (snapshot: VmSnapshot) => {
      const filterEnabled = filters.date != null;
      if (!filterEnabled) {
        return true;
      }
      const start = moment(filters.date).startOf('day');
      const end = moment(filters.date).endOf('day');
      return moment(snapshot.created).isBetween(start, end);
    };

    const filterByVms = (snapshot: VmSnapshot) => {
      const filterEnabled = filters.vmIds.length > 0;
      if (!filterEnabled) {
        return true;
      }
      return filters.vmIds.findIndex(id => id === snapshot.virtualmachineid) >= 0;
    };

    return snapshots.filter(
      snapshot => filterByAccounts(snapshot) && filterByDate(snapshot) && filterByVms(snapshot),
    );
  },
);

export const getVmSnapshots = createSelector(
  getFilteredVmSnapshots,
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
        // necessary for grouping
        account: snapshot.account,
        domain: snapshot.domain,
      };
      return viewModel;
    });
  },
);

export const getFilteredSnapshots = createSelector(
  volumeSnapshotsSelectors.selectAll,
  getFilters,
  (snapshots, filter) => {
    const filterByTypes = (snapshot: Snapshot) =>
      !filter.volumeSnapshotTypes.length ||
      !!filter.volumeSnapshotTypes.find(type => type === snapshot.snapshottype);

    const filterByAccount = (snapshot: Snapshot) =>
      !filter.accounts.length || !!filter.accounts.find(id => id === snapshot.account);

    const filterByDate = (snapshot: Snapshot) =>
      !filter.date ||
      moment(snapshot.created).isBetween(
        moment(filter.date).startOf('day'),
        moment(filter.date).endOf('day'),
      );

    const queryLower = filter.query && filter.query.toLowerCase();
    const filterByQuery = (snapshot: Snapshot) => {
      return (
        !filter.query ||
        snapshot.name.toLowerCase().indexOf(queryLower) > -1 ||
        (getSnapshotDescription(snapshot) &&
          getSnapshotDescription(snapshot)
            .toLowerCase()
            .indexOf(queryLower) > -1)
      );
    };

    return snapshots.filter(
      (snapshot: Snapshot) =>
        filterByAccount(snapshot) &&
        filterByTypes(snapshot) &&
        filterByDate(snapshot) &&
        filterByQuery(snapshot),
    );
  },
);
