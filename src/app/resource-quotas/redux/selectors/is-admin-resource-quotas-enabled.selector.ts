import { createSelector } from '@ngrx/store';
import { get } from '../../../root-store/config/config.selectors';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';

export const selectIsAdminResourceQuotasEnabled = createSelector(
  get('extensions'),
  fromAccounts.selectIsUserAdmin,
  ({ resourceLimits }, isAdmin) => resourceLimits && isAdmin,
);
