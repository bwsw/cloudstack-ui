import { Snapshot, SnapshotStates, SnapshotType } from '../../shared/models';
import * as snapshotSelectors from './snapshot-page.selectors';

describe('Snapshot page selectors', () => {
  it('should select filtered volume snapshots', () => {
    const differentSnapshots: Snapshot[] = [
      {
        id: '1',
        domain: 'test-domain',
        domainid: 'test-domain-id',
        created: '2016-01-11T15:59:42+0700',
        physicalsize: 100,
        volumeid: 'volume-id-2',
        name: 'snapshot for testing',
        tags: [],
        state: SnapshotStates.BackedUp,
        revertable: true,
        snapshottype: SnapshotType.Daily,
        account: 'develop',
      },
      {
        id: '2',
        domain: 'test-domain',
        domainid: 'test-domain-id',
        created: '2017-10-15T15:59:42+0700',
        physicalsize: 100,
        volumeid: 'volume-id-3',
        name: 'snapshot for testing',
        tags: [],
        state: SnapshotStates.BackedUp,
        revertable: false,
        snapshottype: SnapshotType.Manual,
        account: 'test',
      },
    ];

    const volumesVmIds = ['volume-id-2', 'volume-id-3'];

    let slice = snapshotSelectors.getFilteredSnapshots.projector(volumesVmIds, differentSnapshots, {
      accounts: [],
      vmIds: [],
      date: '2017-10-15T00:00:00.000Z',
      query: undefined,
      volumeSnapshotTypes: [],
      volumeVmIds: [],
    });

    expect(slice).toEqual([differentSnapshots[1]]);

    slice = snapshotSelectors.getFilteredSnapshots.projector(volumesVmIds, differentSnapshots, {
      accounts: [],
      vmIds: [],
      volumeVmIds: [],
      date: null,
      query: undefined,
      volumeSnapshotTypes: [SnapshotType.Daily],
    });

    expect(slice).toEqual([differentSnapshots[0]]);

    slice = snapshotSelectors.getFilteredSnapshots.projector(volumesVmIds, differentSnapshots, {
      accounts: ['develop'],
      vmIds: [],
      volumeVmIds: [],
      date: null,
      query: undefined,
      volumeSnapshotTypes: [],
    });

    expect(slice).toEqual([differentSnapshots[0]]);
  });
});
