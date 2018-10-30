import { serviceOfferingType } from '../../../shared/models';
import {
  LOAD_SERVICE_OFFERINGS_REQUEST,
  LOAD_SERVICE_OFFERINGS_RESPONSE,
} from './service-offerings.actions';
import * as fromSOs from './service-offerings.reducers';

describe('Test service offering reducer', () => {
  it('should handle initial state', () => {
    const state = fromSOs.reducer(undefined, { type: '' });
    expect(state).toEqual({
      ids: [],
      entities: {},
      loading: false,
      filters: {
        selectedViewMode: serviceOfferingType.fixed,
        selectedClasses: [],
        query: '',
      },
    });
  });

  it('should set loading', () => {
    const state = fromSOs.reducer(undefined, { type: LOAD_SERVICE_OFFERINGS_REQUEST });
    expect(state).toEqual({
      ids: [],
      entities: {},
      loading: true,
      filters: {
        selectedViewMode: serviceOfferingType.fixed,
        selectedClasses: [],
        query: '',
      },
    });
  });

  it('should set entities', () => {
    const state = fromSOs.reducer(undefined, {
      type: LOAD_SERVICE_OFFERINGS_RESPONSE,
      payload: [{ id: '1', name: 'off1' }, { id: '2', name: 'off2' }],
    });
    expect(state).toEqual({
      ids: ['1', '2'],
      entities: { 1: { id: '1', name: 'off1' }, 2: { id: '2', name: 'off2' } },
      loading: false,
      filters: {
        selectedViewMode: serviceOfferingType.fixed,
        selectedClasses: [],
        query: '',
      },
    } as any);
  });

  it('should get state', () => {
    const state = fromSOs.reducer(undefined, {
      type: LOAD_SERVICE_OFFERINGS_RESPONSE,
      payload: [{ id: '1', name: 'off1' }, { id: '2', name: 'off2' }],
    });
    expect(state).toEqual({
      ids: ['1', '2'],
      entities: { 1: { id: '1', name: 'off1' }, 2: { id: '2', name: 'off2' } },
      loading: false,
      filters: {
        selectedViewMode: serviceOfferingType.fixed,
        selectedClasses: [],
        query: '',
      },
    } as any);
    expect(fromSOs.getOfferingsEntitiesState.projector({ list: state })).toBe(state);
    expect(fromSOs.isLoading.projector(state)).toBe(false);
    expect(fromSOs.getSelectedOffering.projector(state.entities, { serviceofferingid: 1 })).toEqual(
      {
        id: '1',
        name: 'off1',
      },
    );
  });
});
