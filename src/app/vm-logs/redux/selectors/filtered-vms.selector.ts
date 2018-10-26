import { createSelector } from '@ngrx/store';
import * as fromVMs from '../../../reducers/vm/redux/vm.reducers';
import { filterSelectedAccountIds, filterSelectedVmId } from '../vm-logs-vm.reducers';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';

export const selectFilteredVMs = createSelector(
  fromVMs.selectAll,
  filterSelectedAccountIds,
  filterSelectedVmId,
  fromAccounts.selectAll,
  (vms, selectedAccountIds, selectedVmId, accounts) => {
    const selectedAccounts = accounts.filter(account =>
      selectedAccountIds.find(id => id === account.id),
    );
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const domainsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.domainid]: i }), {});

    const selectedAccountIdsFilter = vm =>
      !selectedAccountIds.length || (accountsMap[vm.account] && domainsMap[vm.domainid]);

    const selectedVm = vms.find(vm => vm.id === selectedVmId);
    const filteredVms = vms.filter(selectedAccountIdsFilter);

    if (!filteredVms.find(vm => vm.id === selectedVmId) && selectedVm) {
      return filteredVms.concat(selectedVm);
    }

    return filteredVms;
  },
);
