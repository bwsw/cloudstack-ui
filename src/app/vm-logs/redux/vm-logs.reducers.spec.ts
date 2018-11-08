import { VmLogsActionTypes } from './vm-logs.actions';
import {
  reducer,
  initialState,
  selectVisibleStaticLogs,
  selectVisibleAutoUpdateLogs,
  selectVisibleLogs,
  selectAreAllLogsShown,
  selectTotalScrollLogs,
} from './vm-logs.reducers';

describe('VM logs reducer', () => {
  it('should set loading', () => {
    const state = reducer(undefined, { type: VmLogsActionTypes.LOAD_VM_LOGS_REQUEST });
    expect(state).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should set entities', () => {
    [
      VmLogsActionTypes.LOAD_VM_LOGS_RESPONSE,
      VmLogsActionTypes.LOAD_AUTO_UPDATE_VM_LOGS_RESPONSE,
    ].forEach(type => {
      const logs = [
        {
          id: 'test-id1',
          log: 'test-log1',
          timestamp: 'test-timestamp1',
          file: 'test-file1',
        },
        {
          id: 'test-id2',
          log: 'test-log2',
          timestamp: 'test-timestamp2',
          file: 'test-file2',
        },
      ];

      const state = reducer(undefined, {
        type,
        payload: logs,
      } as any);

      expect(state.ids.length).toBe(2);
      expect(state.entities[state.ids[0]]).toEqual(logs[0]);
      expect(state.entities[state.ids[1]]).toEqual(logs[1]);
      expect(state.loading).toBe(false);
    });
  });

  it('should update search', () => {
    const search = 'test-search';

    const state = reducer(undefined, {
      type: VmLogsActionTypes.VM_LOGS_UPDATE_SEARCH,
      payload: search,
    });

    expect(state).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        search,
      },
    });
  });

  it('should toggle newest first', () => {
    const toggledState = reducer(undefined, {
      type: VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST,
    });

    expect(toggledState).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        newestFirst: true,
      },
    });

    const toggledTwiceState = reducer(toggledState, {
      type: VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST,
    });

    expect(toggledTwiceState).toEqual(initialState);
  });

  it('should remove all logs on auto update', () => {
    [VmLogsActionTypes.ENABLE_AUTO_UPDATE, VmLogsActionTypes.DISABLE_AUTO_UPDATE].forEach(type => {
      const state = reducer(
        {
          ...initialState,
          ids: ['id1'],
          entities: {
            id1: {
              id: 'id1',
              timestamp: 'test1',
              log: 'test1',
              file: 'test1',
            },
          },
        },
        { type } as any,
      );

      expect(state).toEqual(initialState);
    });
  });

  it('should select visible static logs', () => {
    const logs = [1, 2, 3];

    expect(selectVisibleStaticLogs.projector(logs, 0)).toEqual([]);
    expect(selectVisibleStaticLogs.projector(logs, 1)).toEqual([1]);
    expect(selectVisibleStaticLogs.projector(logs, 2)).toEqual([1, 2]);
    expect(selectVisibleStaticLogs.projector(logs, 3)).toEqual([1, 2, 3]);
  });

  it('should select visible auto update logs', () => {
    const logs = [1, 2, 3, 4, 5];

    // Should select all logs.
    expect(selectVisibleAutoUpdateLogs.projector(logs, 5, false, 5)).toEqual(logs);
    expect(selectVisibleAutoUpdateLogs.projector(logs, 5, true, 5)).toEqual(logs);

    // Oldest logs go first.
    // Selects 3 most recent logs (3, 4, 5), according to showLastMessages.
    // Selects the first two of them (3, 4), according to totalScrollLogs.
    expect(selectVisibleAutoUpdateLogs.projector(logs, 3, false, 2)).toEqual([3, 4]);

    // Newest logs go first
    // Selects 3 most recent logs (1, 2, 3), according to showLastMessages.
    // Selects the first two of them (1, 2), according to totalScrollLogs.
    expect(selectVisibleAutoUpdateLogs.projector(logs, 3, true, 2)).toEqual([1, 2]);

    // Selects 3 most recent logs (1, 2, 3), according to showLastMessages.
    // Selects 4 logs. Result can't be bigger than the length of logs from the previous step
    expect(selectVisibleAutoUpdateLogs.projector(logs, 1, false, 4)).toEqual([5]);
    expect(selectVisibleAutoUpdateLogs.projector(logs, 1, true, 4)).toEqual([1]);
  });

  it('should select visible logs', () => {
    const staticLogs = ['static-log'];
    const autoUpdateLogs = ['auto-update-log'];

    expect(selectVisibleLogs.projector(staticLogs, autoUpdateLogs, false)).toEqual(staticLogs);
    expect(selectVisibleLogs.projector(staticLogs, autoUpdateLogs, true)).toEqual(autoUpdateLogs);
  });

  it('should select if all logs are shown according to the scroll limit', () => {
    const logs = [1, 2, 3];

    expect(selectAreAllLogsShown.projector(logs, 2)).toBe(false);
    expect(selectAreAllLogsShown.projector(logs, 3)).toBe(true);
    expect(selectAreAllLogsShown.projector(logs, 4)).toBe(true);
  });

  it('should select total scroll logs', () => {
    expect(selectTotalScrollLogs.projector(1)).toBe(100);
    expect(selectTotalScrollLogs.projector(2)).toBe(200);
  });
});
