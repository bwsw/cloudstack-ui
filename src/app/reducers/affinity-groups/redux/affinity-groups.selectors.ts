import { createSelector } from '@ngrx/store';
import * as fromAffinityGroups from './affinity-groups.reducers';
import { AffinityGroup } from '../../../shared/models';

const sortBySelected = (a: AffinityGroup, b: AffinityGroup) => {
  const aIsPreselected = a.isPreselected;
  const bIsPreselected = b.isPreselected;

  if (aIsPreselected && bIsPreselected) {
    return a.name.localeCompare(b.name);
  }
  if (!aIsPreselected && !bIsPreselected) {
    return a.name.localeCompare(b.name);
  }
  if (aIsPreselected && !bIsPreselected) {
    return -1;
  }
  if (!aIsPreselected && bIsPreselected) {
    return 1;
  }
};

export const getSelectSorted = (preselectedAffinityGroups: AffinityGroup[] | any) => createSelector(
  fromAffinityGroups.selectAll,
  (affinityGroups: AffinityGroup[]): AffinityGroup[] => {
    if (preselectedAffinityGroups) {
      const list = affinityGroups.map(group => {
        const isPreselected = !!preselectedAffinityGroups.find(preselected => preselected.id === group.id);
        return { ...group, isPreselected }
      });
      list.sort(sortBySelected);
      return list;
    }
    return affinityGroups;
  });
