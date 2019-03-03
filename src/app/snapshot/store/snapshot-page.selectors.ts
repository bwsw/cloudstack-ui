import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as moment from 'moment';
import * as volumeSnapshotsSelectors from '../../reducers/snapshots/redux/snapshot.reducers';
import * as vmSelectors from '../../reducers/vm/redux/vm.reducers';
import * as volumeSelectors from '../../reducers/volumes/redux/volumes.reducers';
import { vmSnapshotsSelectors } from '../../root-store/server-data/vm-snapshots';
import { getSnapshotDescription, Snapshot, Volume } from '../../shared/models';
import { getSnapshotType, VmSnapshot } from '../../shared/models/vm-snapshot.model';
import { SnapshotType } from '../../shared/types';
import { VirtualMachine, VmState } from '../../vm';
import { Filters } from '../models/filters.model';
import { VmSnapshotSidebarViewModel } from '../models/vm-snapshot-sidebar.view-model';
import { VmSnapshotViewModel } from '../models/vm-snapshot.view-model';
import { SnapshotPageState, snapshotPageStoreName } from './snapshot-page.reducer';
import { isUndefined } from 'util';

const getSnapshotPageState = createFeatureSelector<SnapshotPageState>(snapshotPageStoreName);

const getSelectedId = createSelector(getSnapshotPageState, state => state.selectedId);

export const getViewMode = createSelector(getSnapshotPageState, state => state.viewMode);

export const getFilters = createSelector(getSnapshotPageState, (state): Filters => state.filters);

export const getGroupings = createSelector(getSnapshotPageState, state => state.groupings);

export const getSelectedSnapshot = createSelector(
  getSelectedId,
  vmSnapshotsSelectors.selectAll,
  volumeSnapshotsSelectors.selectAll,
  (selectedId, vmSnapsots, volumeSnapshots): Snapshot | VmSnapshot =>
    [...vmSnapsots, ...volumeSnapshots].find(snap => snap.id === selectedId),
);

export const getSelectedSnapshotForSidebar = createSelector(
  getSelectedSnapshot,
  vmSelectors.selectEntities,
  (snapshot, vmEntities): Snapshot | VmSnapshotSidebarViewModel => {
    if (getSnapshotType(snapshot) === SnapshotType.VM) {
      const vmSnapshot: VmSnapshot = snapshot as VmSnapshot;
      const vm: VirtualMachine = vmEntities[vmSnapshot.virtualmachineid];
      const vmName: string = vm ? vm.displayname : '';
      const vmState: VmState = vm ? vm.state : undefined;
      const viewModel: VmSnapshotSidebarViewModel = {
        vmName,
        vmState,
        id: vmSnapshot.id,
        state: vmSnapshot.state,
        name: vmSnapshot.displayname,
        description: vmSnapshot.description,
        vmId: vmSnapshot.virtualmachineid,
        created: moment(vmSnapshot.created).toDate(),
        type: vmSnapshot.type,
        current: vmSnapshot.current,
        parentName: vmSnapshot.parentName,
      };
      return viewModel;
    }

    // todo: volume snapshot view model
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
      return filters.accounts.includes(snapshot.account);
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
      return filters.vmIds.includes(snapshot.virtualmachineid);
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
        // account and domain are necessary for grouping
        account: snapshot.account,
        domain: snapshot.domain,
      };
      return viewModel;
    });
  },
);

export const getFilteredVolumesByVmId = createSelector(
  volumeSelectors.selectAll,
  getFilters,
  (volumes, filter) => {
    const filterByVms = (volume: Volume) => {
      const filterEnabled = filter.volumeVmIds.length > 0;
      const noVmEnabled =
        !isUndefined(filter.volumeVmIds.find(id => id === 'noVm')) &&
        isUndefined(volume.virtualmachineid);
      if (!filterEnabled || noVmEnabled) {
        return true;
      }
      return filter.volumeVmIds.includes(volume.virtualmachineid);
    };
    return volumes.filter(filterByVms).map(vol => vol.id);
  },
);

export const getFilteredSnapshots = createSelector(
  getFilteredVolumesByVmId,
  volumeSnapshotsSelectors.selectAll,
  getFilters,
  volumeSelectors.selectEntities,
  (filteredVolumes, snapshots, filter, volumesEntities) => {
    const filterByTypes = (snapshot: Snapshot) =>
      !filter.volumeSnapshotTypes.length ||
      filter.volumeSnapshotTypes.includes(snapshot.snapshottype);

    const filterByAccount = (snapshot: Snapshot) =>
      !filter.accounts.length || filter.accounts.find(id => id === snapshot.account);

    const filterByDate = (snapshot: Snapshot) =>
      !filter.date ||
      moment(snapshot.created).isBetween(
        moment(filter.date).startOf('day'),
        moment(filter.date).endOf('day'),
      );

    const queryLower = filter.query && filter.query.toLowerCase();

    const filterByQuery = (snapshot: Snapshot) => {
      const snapshotDescription = getSnapshotDescription(snapshot);
      return (
        !filter.query ||
        snapshot.name.toLowerCase().includes(queryLower) ||
        (snapshotDescription && snapshotDescription.toLowerCase().includes(queryLower))
      );
    };

    const filterByVms = (snapshot: Snapshot) => {
      if (
        (filter.volumeVmIds.length === 0 || !!filter.volumeVmIds.find(id => id === 'noVm')) &&
        !volumesEntities[snapshot.volumeid]
      ) {
        return true;
      }

      return filteredVolumes.includes(snapshot.volumeid);
    };

    return snapshots.filter(
      (snapshot: Snapshot) =>
        filterByAccount(snapshot) &&
        filterByTypes(snapshot) &&
        filterByDate(snapshot) &&
        filterByVms(snapshot) &&
        filterByQuery(snapshot),
    );
  },
);
