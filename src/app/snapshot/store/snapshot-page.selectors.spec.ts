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

    const volumeEntities = [{ 'volume-id-2': { id: 2 } }, { 'volume-id-3': { id: 3 } }];

    const volumesVmIds = [{ id: 'volume-id-2' }, { id: 'volume-id-3' }];

    let slice = snapshotSelectors.getFilteredSnapshots.projector(
      volumesVmIds,
      differentSnapshots,
      {
        accounts: [],
        vmIds: [],
        startDate: '2017-10-15T00:00:00.000Z',
        endDate: '2017-10-15T00:00:00.000Z',
        query: undefined,
        volumeSnapshotTypes: [],
        volumeVmIds: [],
      },
      volumeEntities,
    );
    expect(slice).toEqual([differentSnapshots[1]]);

    slice = snapshotSelectors.getFilteredSnapshots.projector(
      volumesVmIds,
      differentSnapshots,
      {
        accounts: [],
        vmIds: [],
        startDate: '2017-10-16T00:00:00.000Z',
        endDate: '2017-10-17T00:00:00.000Z',
        query: undefined,
        volumeSnapshotTypes: [],
        volumeVmIds: [],
      },
      volumeEntities,
    );
    expect(slice).toEqual([]);

    slice = snapshotSelectors.getFilteredSnapshots.projector(
      volumesVmIds,
      differentSnapshots,
      {
        accounts: [],
        vmIds: [],
        volumeVmIds: [],
        startDate: null,
        endDate: null,
        query: undefined,
        volumeSnapshotTypes: [SnapshotType.Daily],
      },
      volumeEntities,
    );
    expect(slice).toEqual([differentSnapshots[0]]);

    slice = snapshotSelectors.getFilteredSnapshots.projector(
      volumesVmIds,
      differentSnapshots,
      {
        accounts: ['develop'],
        vmIds: [],
        volumeVmIds: [],
        startDate: null,
        endDate: null,
        query: undefined,
        volumeSnapshotTypes: [],
      },
      volumeEntities,
    );
    expect(slice).toEqual([differentSnapshots[0]]);
  });
});
