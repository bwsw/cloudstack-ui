import {
  LOAD_VM_LOGS_REQUEST,
  LOAD_VM_LOGS_RESPONSE,
  VM_LOGS_ADD_KEYWORD,
  VM_LOGS_REMOVE_KEYWORD
} from './vm-logs.actions';
import * as fromVmLogs from './vm-logs.reducers';
import { initialState } from './vm-logs.reducers';


describe('VM logs reducer', () => {
  it('should set loading', () => {
    const state = fromVmLogs.reducer(undefined, { type: LOAD_VM_LOGS_REQUEST });
    expect(state).toEqual({
      ...initialState,
      loading: true,
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
  });

  it('should add keywords', () => {
    const keyword = {
      text: 'test-keyword'
    };

    const state = fromVmLogs.reducer(undefined, {
      type: VM_LOGS_ADD_KEYWORD,
      payload: keyword
    });

    expect(state).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        keywords: [keyword]
      }
    });
  });

  it('should remove keywords', () => {
    const keyword = {
      text: 'test-keyword'
    };

    const state = fromVmLogs.reducer({
      ...initialState,
      filters: {
        ...initialState.filters,
        keywords: [keyword]
      }
    }, {
      type: VM_LOGS_REMOVE_KEYWORD,
      payload: keyword
    });

    expect(state).toEqual(initialState);
  });
});
