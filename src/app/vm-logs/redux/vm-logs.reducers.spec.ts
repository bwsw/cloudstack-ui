import { VmLogsActionTypes } from './vm-logs.actions';
import * as fromVmLogs from './vm-logs.reducers';
import { initialState } from './vm-logs.reducers';
import moment = require('moment');


describe('VM logs reducer', () => {
  const date = moment(0);

  beforeAll(() => {
    jasmine.clock().mockDate(date.toDate());
  });

  it('should set loading', () => {
    const state = fromVmLogs.reducer(undefined, { type: VmLogsActionTypes.LOAD_VM_LOGS_REQUEST });
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
      type: VmLogsActionTypes.LOAD_VM_LOGS_RESPONSE,
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
      type: VmLogsActionTypes.VM_LOGS_FILTER_UPDATE,
      payload: {
        selectedVmId,
      }
    });

    expect(state).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        selectedVmId,
      }
    });
  });

  it('should add keywords', () => {
    const keyword = {
      text: 'test-keyword'
    };

    const state = fromVmLogs.reducer(undefined, {
      type: VmLogsActionTypes.VM_LOGS_ADD_KEYWORD,
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
      type: VmLogsActionTypes.VM_LOGS_REMOVE_KEYWORD,
      payload: keyword
    });

    expect(state).toEqual(initialState);
  });

  it('should toggle newest first', () => {
    const toggledState = fromVmLogs.reducer(undefined, {
      type: VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST
    });

    expect(toggledState).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        newestFirst: true,
      }
    });

    const toggledTwiceState = fromVmLogs.reducer(toggledState, {
      type: VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST
    });

    expect(toggledTwiceState).toEqual(initialState);
  });

  const defaultId = 'test-id';
  const defaultDate = '1970-01-01T00:00:00.000';
  const defaultSort = 'timestamp';
  const defaultRequestParams = {
    id: defaultId,
    startDate: defaultDate,
    endDate: defaultDate,
    sort: defaultSort
  };

  it('should select load logs request params without keywords', () => {
    const id = 'test-id';
    const keywords = [];

    const params = fromVmLogs.loadVmLogsRequestParams.projector(
      id,
      keywords
    );

    expect(params).toEqual(defaultRequestParams);
  });

  it('should select load logs request params with keywords', () => {
    const id = 'test-id';
    const keywords = [
      { text: 'test-keyword1' },
      { text: 'test-keyword2' }
    ];

    const params = fromVmLogs.loadVmLogsRequestParams.projector(
      id,
      keywords
    );

    expect(params).toEqual({
      ...defaultRequestParams,
      keywords: 'test-keyword1,test-keyword2',
    });
  });

  it('should set sort: -timestamp if newest first = true', () => {
    const id = 'test-id';

    const params = fromVmLogs.loadVmLogsRequestParams.projector(
      id,
      [],
      date,
      date,
      true
    );

    expect(params).toEqual({
      ...defaultRequestParams,
      sort: '-timestamp'
    });
  });
});