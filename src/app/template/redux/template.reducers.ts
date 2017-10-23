import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TemplateFilters } from '../shared/base-template.service';
import { Account } from '../../shared/models/account.model';
import { osTypes } from './ostype.reducers';
import { BaseTemplateModel } from '../shared/base-template.model';
import { User } from '../../shared/models/user.model';
import * as template from './template.actions';

export interface ListState extends EntityState<BaseTemplateModel> {
  loading: boolean,
  filters: {
    currentUser: User,
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
    currentUser: new User(),
    selectedViewMode: 'Template',
    selectedOsFamilies: [],
    selectedZones: [],
    selectedGroupings: [],
    selectedAccounts: [],
    selectedTypes: [],
    query: ''
  }
};

export interface TemplatesState {
  list: ListState
};

export const templateReducers = {
  list: listReducer,
};

export const adapter: EntityAdapter<BaseTemplateModel> = createEntityAdapter<BaseTemplateModel>({
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

export const filterQuery = createSelector(
  filters,
  state => state.query
);

export const currentUser = createSelector(
  filters,
  state => state.currentUser
);

export const selectByViewMode = createSelector(
  selectAll,
  filterSelectedViewMode,
  (templates, viewMode) => {
    const selectedViewModeFilter = (template: BaseTemplateModel) => {
      return viewMode.toLowerCase() === template.resourceType.toLowerCase();
    };

    return templates.filter((template: BaseTemplateModel) => selectedViewModeFilter(
      template));
  }
);

export const selectFilteredTemplates = createSelector(
  selectByViewMode,
  filterSelectedAccounts,
  osTypes,
  filterSelectedOsFamilies,
  filterSelectedZones,
  filterSelectedTypes,
  currentUser,
  filterQuery,
  (
    templates,
    selectedAccounts,
    osTypes,
    selectedOsFamilies,
    selectedZones,
    selectedTypes,
    user,
    query
  ) => {
    const accountsMap = selectedAccounts.reduce((m, i: Account) => ({
      ...m,
      [`${i.domainid}-${i.name}`]: i
    }), {});
    const osFamiliesMap = selectedOsFamilies.reduce((m, i) => ({ ...m, [i]: i }), {});
    const osTypesMap = osTypes.reduce((m, i) => ({ ...m, [i.id]: i }), {});
    const zonesMap = selectedZones.reduce((m, i) => ({ ...m, [i]: i }), {});
    const typesMap = selectedTypes.reduce((m, i) => ({ ...m, [i]: i }), {});

    const selectedTypesFilter = ((template: BaseTemplateModel) => {
      const featuredFilter = !selectedTypes || typesMap[TemplateFilters.featured] || !template.isFeatured;
      const selfFilter = !selectedTypes || typesMap[TemplateFilters.self] || !(template.account === user.username);
      return featuredFilter && selfFilter;
    });

    const selectedAccountsFilter = (template: BaseTemplateModel) => {
      const account = `${template.domainId}-${template.account}`;
      return !selectedAccounts.length || !!accountsMap[account];
    };
    const selectedOsFamiliesFilter = (template: BaseTemplateModel) => {
      const osFamily = osTypesMap[template.osTypeId]
        ? osTypesMap[template.osTypeId].osFamily
        : '';
      return !selectedOsFamilies.length || !!osFamiliesMap[osFamily];
    };

    const selectedZonesFilter = (template: BaseTemplateModel) => {
      return !selectedZones.length || !!zonesMap[template.zoneId];
    };

    const queryFilter = (template: BaseTemplateModel) => {
      if (query) {
        const queryLower = query.toLowerCase();
        return template.name.toLowerCase().includes(queryLower) ||
          template.displayText.toLowerCase().includes(queryLower);
      }
      return !query;
    };

    return templates.filter(template => {
      return selectedAccountsFilter(template)
        && selectedZonesFilter(template)
        && selectedTypesFilter(template)
        && selectedOsFamiliesFilter(template)
        && queryFilter(template);
    });
  }
  )
;
