import { VmLogsActionTypes } from './vm-logs.actions';
import * as fromVmLogsAutoUpdate from './vm-logs-auto-update.reducers';
import { initialState } from './vm-logs-auto-update.reducers';


describe('VM logs auto update reducer', () => {
  it('should enable auto update', () => {
    const state = fromVmLogsAutoUpdate.reducer({
      ...initialState,
      isAutoUpdateEnabled: false,
    }, {
      type: VmLogsActionTypes.ENABLE_AUTO_UPDATE,
    });

    expect(state).toEqual({
      ...initialState,
      isAutoUpdateEnabled: true,
    });
  });

  it('should disable auto update', () => {
    const state = fromVmLogsAutoUpdate.reducer({
      ...initialState,
      isAutoUpdateEnabled: true,
    }, {
      type: VmLogsActionTypes.DISABLE_AUTO_UPDATE,
    });

    expect(state).toEqual({
      ...initialState,
      isAutoUpdateEnabled: false,
    });
  });

  const getDateObject = () => ({
    years: 0,
    months: 0,
    date: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  it('should set start date', () => {
    const startDate = getDateObject();

    const state = fromVmLogsAutoUpdate.reducer(undefined, {
      type: VmLogsActionTypes.SET_AUTO_UPDATE_START_DATE,
      payload: startDate,
    });

    expect(state).toEqual({
      ...initialState,
      startDate,
    });
  });

  it('should set end date', () => {
    const endDate = getDateObject();

    const state = fromVmLogsAutoUpdate.reducer(undefined, {
      type: VmLogsActionTypes.SET_AUTO_UPDATE_END_DATE,
      payload: endDate,
    });

    expect(state).toEqual({
      ...initialState,
      endDate,
    });
  });
});
