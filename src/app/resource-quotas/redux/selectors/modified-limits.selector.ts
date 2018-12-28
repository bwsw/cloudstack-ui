import { createSelector } from '@ngrx/store';
import { diff } from 'deep-diff';
import * as fromResourceQuotas from '../resource-quotas.reducer';
import * as fromUserForm from '../resource-quotas-user-form.reducer';

export const getModifiedLimits = createSelector(
  fromResourceQuotas.getResourceQuotas,
  fromUserForm.getUserResourceQuotasForm,
  (quotas, quotasForm) => {
    const modifiedQuotas = diff(quotas, quotasForm) || [];
    const modifiedResourceTypes = modifiedQuotas.map(diffRecord => diffRecord.path[0]);
    return modifiedResourceTypes.map(resourceType => ({
      resourceType,
      ...quotasForm[resourceType],
    }));
  },
);
