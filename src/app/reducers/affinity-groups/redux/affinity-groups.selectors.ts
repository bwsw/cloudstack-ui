import { createSelector } from '@ngrx/store';
import * as fromAffinityGroups from './affinity-groups.reducers';
import * as fromVMs from '../../../reducers/vm/redux/vm.reducers';

import { AffinityGroup, emptyAffinityGroup } from '../../../shared/models';

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

export const setAffinityGroupsState = (
  affinityGroups: AffinityGroup[],
  preselectedGroups: AffinityGroup[],
): AffinityGroup[] => {
  if (preselectedGroups) {
    const list = affinityGroups.map(group => {
      const isPreselected = !!preselectedGroups.find(preselected => {
        if (preselected && group) {
          return preselected.id === group.id;
        }
      });
      return { ...group, isPreselected };
    });
    return list;
  }
  return affinityGroups;
};

const sortAffinityGroups = (affinityGroups: AffinityGroup[]) => {
  return affinityGroups.sort(sortBySelected);
};

const isHasPreselected = (groups: AffinityGroup[]) => {
  return !!groups.find(group => group.isPreselected);
};

export const getAffinityGroupsForVmForm = createSelector(
  fromAffinityGroups.selectAll,
  fromVMs.getVmFormStateAffinityGroup,
  (affinityGroups: AffinityGroup[], preselectedGroup: AffinityGroup): AffinityGroup[] => {
    const groups = setAffinityGroupsState(affinityGroups, [preselectedGroup]);

    const emptyGroup = {
      id: emptyAffinityGroup,
      name: emptyAffinityGroup,
      isPreselected: !isHasPreselected(groups),
    } as AffinityGroup;

    groups.unshift(emptyGroup);
    return groups;
  },
);

export const getSortedAffinityGroupsForVmDetails = createSelector(
  fromAffinityGroups.selectAll,
  fromVMs.getSelectedVmAffinityGroups,
  (affinityGroups: AffinityGroup[], preselectedGroups: AffinityGroup[]): AffinityGroup[] => {
    const list = setAffinityGroupsState(affinityGroups, preselectedGroups);
    return sortAffinityGroups(list);
  },
);
