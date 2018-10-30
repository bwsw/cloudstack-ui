import { VmLogsActionTypes } from './vm-logs.actions';
import { reducer, initialState } from './vm-logs.reducers';

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
          log: 'test-log1',
          timestamp: 'test-timestamp1',
          file: 'test-file1',
        },
        {
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

  it('should add keywords', () => {
    const keyword = {
      text: 'test-keyword',
    };

    const state = reducer(undefined, {
      type: VmLogsActionTypes.VM_LOGS_ADD_KEYWORD,
      payload: keyword,
    });

    expect(state).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        keywords: [keyword],
      },
    });
  });

  it('should remove keywords', () => {
    const keyword = {
      text: 'test-keyword',
    };

    const state = reducer(
      {
        ...initialState,
        filters: {
          ...initialState.filters,
          keywords: [keyword],
        },
      },
      {
        type: VmLogsActionTypes.VM_LOGS_REMOVE_KEYWORD,
        payload: keyword,
      },
    );

    expect(state).toEqual(initialState);
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
});
