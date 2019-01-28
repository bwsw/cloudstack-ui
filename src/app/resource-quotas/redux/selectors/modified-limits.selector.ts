import { createSelector } from '@ngrx/store';
import { diff } from 'deep-diff';
import * as fromResourceLimits from '../../../reducers/resource-limit/redux/resource-limits.reducers';
import * as fromUserForm from '../resource-quotas-user-form.reducer';

const mapValues = require('lodash/mapValues');

export const getModifiedLimits = createSelector(
  fromResourceLimits.selectEntities,
  fromUserForm.getUserResourceLimits,
  (limits, limitsForm) => {
    const modifiedQuotas = diff(mapValues(limits, 'max'), limitsForm) || [];
    const modifiedResourceTypes = modifiedQuotas.map(diffRecord => diffRecord.path[0]);
    return modifiedResourceTypes.map(resourceType => ({
      resourceType,
      max: limitsForm[resourceType],
    }));
  },
);
