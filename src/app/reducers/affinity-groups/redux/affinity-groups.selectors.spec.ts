import * as affinityGroupSelectors from './affinity-groups.selectors';
import { AffinityGroup, AffinityGroupType } from '../../../shared/models';

describe('Affinity Group Selectors', () => {
  it('should get sorted groups', () => {
    const list = [
      {
        id: '1',
        name: 'af1',
        type: AffinityGroupType.affinity,
      },
      {
        id: '2',
        name: 'af2',
        type: AffinityGroupType.affinity,
      },
    ] as AffinityGroup[];

    const preselected = [
      {
        id: '2',
        name: 'af2',
        type: AffinityGroupType.affinity,
      },
    ] as AffinityGroup[];

    const sortedList = [
      {
        id: '2',
        name: 'af2',
        type: AffinityGroupType.affinity,
        isPreselected: true,
      },
      {
        id: '1',
        name: 'af1',
        type: AffinityGroupType.affinity,
        isPreselected: false,
      },
    ] as AffinityGroup[];

    expect(
      affinityGroupSelectors.getSortedAffinityGroupsForVmDetails.projector(list, preselected),
    ).toEqual(sortedList);
  });
});
