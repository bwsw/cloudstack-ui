import { createSelector } from '@ngrx/store';
import * as moment from 'moment';
import * as vmSelectors from '../../reducers/vm/redux/vm.reducers';
import { vmSnapshotsSelectors } from '../../root-store';
import { VmSnapshot } from '../../shared/models/vm-snapshot.model';
import { VirtualMachine, VmState } from '../../vm';
import { VmSnapshotViewModel } from '../models/vm-snapshot.view-model';
import * as snapshotPageSelectors from './snapshot-page.selectors';

const getFilteredVmSnapshots = createSelector(
  vmSnapshotsSelectors.selectAll,
  snapshotPageSelectors.getFilters,
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
