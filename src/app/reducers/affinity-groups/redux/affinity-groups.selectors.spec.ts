import * as affinityGroupSelectors from './affinity-groups.selectors';
import { AffinityGroup, AffinityGroupType } from '../../../shared/models';

describe('Affinity Group Selectors', () => {
  it('should get sorted groups', () => {
    const list = <AffinityGroup[]>[
      {
        id: '1', name: 'af1', type: AffinityGroupType.affinity,
      },
      {
        id: '2', name: 'af2', type: AffinityGroupType.affinity,
      }
    ];

    const preselected = <AffinityGroup[]>[
      {
        id: '2', name: 'af2', type: AffinityGroupType.affinity,
      }
    ];

    const sortedList = <AffinityGroup[]>[
      {
        id: '2', name: 'af2', type: AffinityGroupType.affinity, isPreselected: true
      },
      {
        id: '1', name: 'af1', type: AffinityGroupType.affinity, isPreselected: false
      }
    ];

    expect(affinityGroupSelectors.getSortedAffinityGroups(preselected).projector(
      list,
    ))
      .toEqual(sortedList);
  });
});
