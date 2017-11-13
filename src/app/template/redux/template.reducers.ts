import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TemplateFilters } from '../shared/base-template.service';
import { BaseTemplateModel } from '../shared/base-template.model';
import { TemplateTagKeys } from '../../shared/services/tags/template-tag-keys';
import { getUserAccount } from '../../reducers/auth/redux/auth.reducers';

import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as fromOsTypes from './ostype.reducers';
import * as template from './template.actions';


export interface ListState extends EntityState<BaseTemplateModel> {
  loading: boolean,
  selectedTemplateId: string | null;
  filters: {
    selectedViewMode: string,
    selectedTypes: string[],
    selectedOsFamilies: string[],
    selectedZones: string[],
    selectedGroupings: any[],
    selectedGroups: string[],
    selectedAccountIds: string[],
    query: string
  }
}

const initialListState: ListState = {
  ids: [],
  entities: null,
  loading: false,
  selectedTemplateId: null,
  filters: {
    selectedViewMode: 'Template',
    selectedTypes: [],
    selectedOsFamilies: [],
    selectedZones: [],
    selectedGroupings: [],
    selectedGroups: [],
    selectedAccountIds: [],
    query: ''
  }
};

export interface TemplatesState {
  list: ListState
}

export const templateReducers = {
  list: listReducer
};

export const adapter: EntityAdapter<BaseTemplateModel> = createEntityAdapter<BaseTemplateModel>(
  {
    selectId: (item: BaseTemplateModel) => item.id,
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
        loading: false,
      };
    }
    case template.TEMPLATE_CREATE_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state)
      };
    }
    case template.TEMPLATE_REMOVE_SUCCESS: {
      return adapter.removeOne(action.payload.id, state);
    }
    case template.LOAD_SELECTED_TEMPLATE: {
      return {
        ...state,
        selectedTemplateId: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getTemplatesState = createFeatureSelector<TemplatesState>('templates');

export const getTemplatesEntitiesState = createSelector(
  getTemplatesState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getTemplatesEntitiesState);

export const isLoading = createSelector(
  getTemplatesEntitiesState,
  state => state.loading
);

export const filters = createSelector(
  getTemplatesEntitiesState,
  state => state.filters
);

export const getSelectedId = createSelector(
  getTemplatesEntitiesState,
  state => state.selectedTemplateId
);

export const getSelectedTemplate = createSelector(
  getTemplatesState,
  getSelectedId,
  (state, selectedId) => selectedId && state.list.entities
    ? state.list.entities[selectedId]
    : null
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

export const filterSelectedGroups = createSelector(
  filters,
  state => state.selectedGroups
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds
);

export const filterSelectedOsFamilies = createSelector(
  filters,
  state => state.selectedOsFamilies
);

export const filterQuery = createSelector(
  filters,
  state => state.query
);

export const selectByViewModeAndAccounts = createSelector(
  selectAll,
  filterSelectedViewMode,
  fromAccounts.selectEntities,
  filterSelectedAccountIds,
  (templates, viewMode, accountEntities, selectedAccountIds) => {
    const viewModeStr = viewMode === 'Iso' ? viewMode.toUpperCase() : viewMode;
    const selectedViewModeFilter = (template: BaseTemplateModel) => {
      return viewModeStr === template.resourceType;
    };

    const accountDomainMap = selectedAccountIds
      .filter(id => accountEntities[id])
      .reduce((m, id) => {
        const acc = accountEntities[id];
        return { ...m, [`${acc.name}_${acc.domainid}`]: acc };
      }, {});

    const selectedAccountIdsFilter = template => !selectedAccountIds.length ||
      (accountDomainMap[`${template.account}_${template.domainId}`]);

    return templates.filter((template: BaseTemplateModel) => selectedViewModeFilter(
      template) && selectedAccountIdsFilter(template));
  }
);

export const selectFilteredTemplates = createSelector(
  selectByViewModeAndAccounts,
  fromOsTypes.selectEntities,
  filterSelectedOsFamilies,
  filterSelectedZones,
  filterSelectedGroups,
  filterSelectedTypes,
  getUserAccount,
  filterQuery,
  (
    templates,
    osTypesEntities,
    selectedOsFamilies,
    selectedZones,
    selectedGroups,
    selectedTypes,
    user,
    query
  ) => {

    const osFamiliesMap = selectedOsFamilies.reduce((m, i) => ({ ...m, [i]: i }), {});
    const zonesMap = selectedZones.reduce((m, i) => ({ ...m, [i]: i }), {});
    const typesMap = selectedTypes.reduce((m, i) => ({ ...m, [i]: i }), {});
    const groupsMap = selectedGroups.reduce((m, i) => ({ ...m, [i]: i }), {});
    const queryLower = query && query.toLowerCase();

    const selectedTypesFilter = ((template: BaseTemplateModel) => {
      const featuredFilter = (typesMap[TemplateFilters.featured] && template.isFeatured);
      const selfFilter = !!typesMap[TemplateFilters.self] && (template.account === user.name);
      return !selectedTypes.length || featuredFilter || selfFilter;
    });

    const selectedOsFamiliesFilter = (template: BaseTemplateModel) => {
      const osFamily = osTypesEntities[template.osTypeId]
        ? osTypesEntities[template.osTypeId].osFamily
        : '';
      return !selectedOsFamilies.length || !!osFamiliesMap[osFamily];
    };

    const selectedZonesFilter = (template: BaseTemplateModel) => {
      return !selectedZones.length || !!zonesMap[template.zoneId];
    };

    const selectedGroupsFilter = (template: BaseTemplateModel) => {
      const tag = template.tags.find(_ => _.key === TemplateTagKeys.group);
      const group = tag && tag.value;
      return !selectedGroups.length || !!groupsMap[group];
    };

    const queryFilter = (template: BaseTemplateModel) => !query || template.name.toLowerCase()
        .includes(queryLower) ||
      template.displayText.toLowerCase().includes(queryLower);

    return templates.filter(template => {
      return selectedZonesFilter(template)
        && selectedTypesFilter(template)
        && selectedGroupsFilter(template)
        && selectedOsFamiliesFilter(template)
        && queryFilter(template);
    });
  }
);
