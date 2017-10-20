import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Template } from '../shared/template.model';
import { TemplateFilters } from '../shared/base-template.service';

import * as template from './template.actions';

export interface ListState extends EntityState<Template> {
  loading: boolean,
  filters: {
    selectedViewMode: string,
    selectedTypes: string[],
    selectedOsFamilies: string[],
    selectedZones: string[],
    selectedGroupings: any[],
    selectedAccounts: Account[]
    query: string
  }
}

const initialListState: ListState = {
  ids: [],
  entities: null,
  loading: false,
  filters: {
    selectedViewMode: 'Template',
    selectedTypes: [ TemplateFilters.self, TemplateFilters.featured ],
    selectedOsFamilies: [],
    selectedZones: [],
    selectedGroupings: [],
    selectedAccounts: [],
    query: ''
  }
};

export interface TemplatesState {
  list: ListState
};

export const templateReducers = {
  list: listReducer,
};

export const adapter: EntityAdapter<Template> = createEntityAdapter<Template>({
  selectId: (item: Template) => item.id,
  sortComparer: false
});

export function listReducer(
  state = initialListState,
  action: template.Actions
): ListState {
  switch (action.type) {
    case template.LOAD_TEMPLATE_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case template.TEMPLATE_FILTER_UPDATE: {
      return {
        ...state,
        loading: false,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }
    case template.LOAD_TEMPLATE_RESPONSE: {
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll([...action.payload], state),
      };

    }
    default: {
      return state;
    }
  }
}

export const getTemplatesState = createFeatureSelector<TemplatesState>('templates');

export const getSshKeysEntitiesState = createSelector(
  getTemplatesState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getSshKeysEntitiesState);

export const isLoading = createSelector(
  getSshKeysEntitiesState,
  state => state.loading
);

export const filters = createSelector(
  getSshKeysEntitiesState,
  state => state.filters
);

export const filterSelectedViewMode = createSelector(
  filters,
  state => state.selectedViewMode
);
export const filterSelectedGroupings = createSelector(
  filters,
  state => state.selectedGroupings
);

export const filterSelectedTypes = createSelector(
  filters,
  state => state.selectedTypes
);

export const filterSelectedZones = createSelector(
  filters,
  state => state.selectedZones
);

export const filterSelectedAccounts = createSelector(
  filters,
  state => state.selectedAccounts
);

export const filterSelectedOsFamilies = createSelector(
  filters,
  state => state.selectedOsFamilies
);

export const selectFilteredTemplates = createSelector(
  selectAll,
  filterSelectedViewMode,
  filterSelectedAccounts,
  filterSelectedOsFamilies,
  filterSelectedZones,
  filterSelectedTypes,
  (
    templates,
    selectedViewMode,
    selectedAccounts,
    selectedOsFamilies,
    selectedZones,
    selectedTypes
  ) => {
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const OSFamiliesMap = selectedOsFamilies.reduce((m, i) => ({ ...m, [i]: i }), {});
    const zonesMap = selectedZones.reduce((m, i) => ({ ...m, [i]: i }), {});

    const selectedAccountsFilter = (template: Template) => {
      return !selectedAccounts.length || !!accountsMap[template.account];
    };
    const selectedOsFamiliesFilter = (template: Template) => {
      return !selectedOsFamilies.length || !!OSFamiliesMap[template.osTypeId];
    };
    const selectedZonesFilter = (template: Template) => {
      return !selectedZones.length || !!zonesMap[template.zoneId];
    };
    const selectedViewModeFilter = (template: Template) => {
      return selectedViewMode.toLowerCase() === template.resourceType.toLowerCase();
    };

    const response = templates.filter(template => {
      return selectedViewModeFilter(template);
      // return selectedAccountsFilter(template)
      //   && selectedOsFamiliesFilter(template)
      //   && selectedZonesFilter(template)
      //   && selectedTypeFilter(template);
    });

    return response;
  }
);
