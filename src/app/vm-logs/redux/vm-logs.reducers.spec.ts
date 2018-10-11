import { LOAD_VM_LOGS_REQUEST, LOAD_VM_LOGS_RESPONSE, VM_LOGS_FILTER_UPDATE } from './vm-logs.actions';
import * as fromVmLogs from './vm-logs.reducers';

describe('VM logs reducer', () => {
  it('should handle initial state', () => {
    const state = fromVmLogs.reducer(undefined, { type: '' });
    expect(state).toEqual({
      ids: [],
      entities: {},
      loading: false,
      filters: {
        selectedVmId: null
      }
    });
  });

  it('should set loading', () => {
    const state = fromVmLogs.reducer(undefined, { type: LOAD_VM_LOGS_REQUEST });
    expect(state).toEqual({
      ids: [],
      entities: {},
      loading: true,
      filters: {
        selectedVmId: null
      }
    });
  });

  it('should set entities', () => {
    const logs = [
      {
        log: 'test-log1',
        timestamp: 'test-timestamp1',
        file: 'test-file1'
      },
      {
        log: 'test-log2',
        timestamp: 'test-timestamp2',
        file: 'test-file2'
      }
    ];

    const state = fromVmLogs.reducer(undefined, {
      type: LOAD_VM_LOGS_RESPONSE,
      payload: logs
    });

    expect(state.ids.length).toBe(2);
    expect(state.entities[state.ids[0]]).toEqual(logs[0]);
    expect(state.entities[state.ids[1]]).toEqual(logs[1]);
    expect(state.loading).toBe(false);
    expect(state.filters.selectedVmId).toBe(null);
  });

  it('should update vm id', () => {
    const selectedVmId = 'test-id';
    const state = fromVmLogs.reducer(undefined, {
      type: VM_LOGS_FILTER_UPDATE,
      payload: {
        selectedVmId,
      }
    });

    expect(state).toEqual({
      ids: [],
      entities: {},
      loading: false,
      filters: {
        selectedVmId,
      }
    });
  });
});
