import { SnapshotPageMode, SnapshotStates, SnapshotType } from '../../../shared/models';
import * as fromSnapshots from './snapshot.reducers';
import * as snapshotActions from './snapshot.actions';

describe('Snapshot Reducer', () => {
  const snapshots = [
    {
      description: 'test snapshot #1',
      id: '1',
      created: '2016-01-11T15:59:42+0700',
      physicalsize: 100,
      volumeid: 'volume-id',
      virtualmachineid: undefined,
      name: 'snapshot for testing',
      tags: [],
      state: SnapshotStates.BackedUp,
      revertable: true,
      snapshottype: SnapshotType.Manual,
    },
    {
      description: 'test snapshot #2',
      id: '2',
      created: '2018-01-10T15:59:42+0700',
      physicalsize: 100,
      volumeid: 'volume-id-1',
      virtualmachineid: undefined,
      name: 'snapshot for testing',
      tags: [],
      state: SnapshotStates.BackedUp,
      revertable: false,
      snapshottype: SnapshotType.Manual,
    },
  ];
  const entities = { 2: snapshots[1], 1: snapshots[0] };

  it('undefined action should return default state', () => {
    const { initialListState }: any = fromSnapshots;
    const action = {} as any;
    const state = fromSnapshots.listReducer(undefined, action);

    expect(state).toBe(initialListState);
  });

  it('should set loading to true when snapshots are loading', () => {
    const { initialListState }: any = fromSnapshots;
    const action = new snapshotActions.LoadSnapshotRequest();
    const state = fromSnapshots.listReducer(initialListState, action);

    expect(state.entities).toEqual({});
    expect(state.loading).toEqual(true);
  });

  it('should map an array to entities and sort them by date of creation', () => {
    const { initialListState }: any = fromSnapshots;
    const action = new snapshotActions.LoadSnapshotResponse(snapshots);
    const state = fromSnapshots.listReducer(initialListState, action);

    expect(state.entities).toEqual(entities);
    expect(state.loading).toEqual(false);
    expect(state.ids).toEqual(['2', '1']);
  });

  it('should add new snapshot', () => {
    const { initialListState }: any = fromSnapshots;
    const action = new snapshotActions.AddSnapshotSuccess(snapshots[0]);
    const state = fromSnapshots.listReducer(initialListState, action);

    expect(state.ids).toEqual(['1']);
    expect(state.entities).toEqual({ 1: snapshots[0] });

    const action2 = new snapshotActions.AddSnapshotSuccess(snapshots[1]);
    const state2 = fromSnapshots.listReducer(state, action2);

    expect(state2.ids).toEqual(['2', '1']);
    expect(state2.entities).toEqual({ 2: snapshots[1], 1: snapshots[0] });
  });

  it('should delete snapshot', () => {
    const { initialListState }: any = fromSnapshots;
    const action = new snapshotActions.DeleteSnapshotSuccess(snapshots[0]);
    const state = fromSnapshots.listReducer(
      {
        ...initialListState,
        entities,
        ids: ['2', '1'],
      },
      action,
    );

    expect(state.ids).toEqual(['2']);
    expect(state.entities).toEqual({ 2: snapshots[1] });
  });

  it('should select filtered snapshots', () => {
    const differentSnapshots = [
      {
        description: 'test snapshot #1',
        id: '1',
        created: '2016-01-11T15:59:42+0700',
        physicalsize: 100,
        volumeid: undefined,
        virtualmachineid: 'virtual-machine-id',
        name: 'snapshot for testing',
        tags: [],
        state: SnapshotStates.BackedUp,
        revertable: true,
        snapshottype: SnapshotType.Daily,
        account: 'develop',
      },
      {
        description: 'test snapshot #2',
        id: '1',
        created: '2016-01-11T15:59:42+0700',
        physicalsize: 100,
        volumeid: 'volume-id-2',
        virtualmachineid: undefined,
        name: 'snapshot for testing',
        tags: [],
        state: SnapshotStates.BackedUp,
        revertable: true,
        snapshottype: SnapshotType.Daily,
        account: 'develop',
      },
      {
        description: 'test snapshot #3',
        id: '2',
        created: '2017-10-15T15:59:42+0700',
        physicalsize: 100,
        volumeid: 'volume-id-3',
        virtualmachineid: undefined,
        name: 'snapshot for testing',
        tags: [],
        state: SnapshotStates.BackedUp,
        revertable: false,
        snapshottype: SnapshotType.Manual,
        account: 'test',
      },
    ];
    let slice = fromSnapshots.selectFilteredSnapshots.projector(differentSnapshots, {
      mode: SnapshotPageMode.Volume,
      selectedDate: null,
      selectedAccounts: [],
      selectedTypes: [],
    });

    expect(slice).toEqual([differentSnapshots[1], differentSnapshots[2]]);

    slice = fromSnapshots.selectFilteredSnapshots.projector(differentSnapshots, {
      mode: SnapshotPageMode.Volume,
      selectedDate: '2017-10-15T00:00:00.000Z',
      selectedAccounts: [],
      selectedTypes: [],
    });

    expect(slice).toEqual([differentSnapshots[2]]);

    slice = fromSnapshots.selectFilteredSnapshots.projector(differentSnapshots, {
      mode: SnapshotPageMode.Volume,
      selectedDate: null,
      selectedAccounts: [],
      selectedTypes: [SnapshotType.Daily],
    });

    expect(slice).toEqual([differentSnapshots[1]]);

    slice = fromSnapshots.selectFilteredSnapshots.projector(differentSnapshots, {
      mode: SnapshotPageMode.Volume,
      selectedDate: null,
      selectedTypes: [],
      selectedAccounts: ['develop'],
    });

    expect(slice).toEqual([differentSnapshots[1]]);
  });
});
