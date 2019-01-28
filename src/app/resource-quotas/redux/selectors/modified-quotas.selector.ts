import { createSelector } from '@ngrx/store';
import { diff } from 'deep-diff';
import * as fromResourceQuotas from '../resource-quotas.reducer';
import * as fromAdminForm from '../resource-quotas-admin-form.reducer';

export const getModifiedQuotas = createSelector(
  fromResourceQuotas.getResourceQuotas,
  fromAdminForm.getAdminResourceQuotasForm,
  (quotas, quotasForm) => {
    const modifiedQuotas = diff(quotas, quotasForm) || [];
    const modifiedResourceTypes = modifiedQuotas.map(diffRecord => diffRecord.path[0]);
    return modifiedResourceTypes.map(resourceType => ({
      resourceType,
      ...quotasForm[resourceType],
    }));
  },
);
