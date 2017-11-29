import {
  createEntityAdapter,
  EntityAdapter,
  EntityState
} from '@ngrx/entity';
import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import {
  TemplateFilters,
  TemplateResourceType
} from '../../../template/shared/base-template.service';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { TemplateTagKeys } from '../../../shared/services/tags/template-tag-keys';
import { getUserAccount } from '../../auth/redux/auth.reducers';
import { DefaultTemplateGroupId } from '../../../template/template-sidebar/template-group/template-group.component';

import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as fromOsTypes from './ostype.reducers';
import * as fromTemplateGroups from './template-group.reducers';
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

export interface VmCreationTemplatesState {
  filters: {
    selectedViewMode: string,
    selectedTypes: string[],
    selectedOsFamilies: string[],
    selectedGroups: string[],
    selectedZoneId: string,
    query: string
  }
}

export const adapter: EntityAdapter<BaseTemplateModel> = createEntityAdapter<BaseTemplateModel>(
  {
    selectId: (item: BaseTemplateModel) => item.id,
    sortComparer: false
  });


const initialListState: ListState = adapter.getInitialState({
  loading: false,
  selectedTemplateId: null,
  filters: {
    selectedViewMode: TemplateResourceType.template,
    selectedTypes: [],
    selectedOsFamilies: [],
    selectedZones: [],
    selectedGroupings: [],
    selectedGroups: [],
    selectedAccountIds: [],
    query: ''
  }
});

const initialVmCreationTemplatesState: VmCreationTemplatesState = {
  filters: {
    selectedViewMode: TemplateResourceType.template,
    selectedTypes: [],
    selectedOsFamilies: [],
    selectedGroups: [],
    selectedZoneId: null,
    query: ''
  }
};

export interface TemplatesState {
  list: ListState,
  vmCreationList: VmCreationTemplatesState
}

export const templateReducers = {
  list: listReducer,
  vmCreationList: vmCreationListReducer
};

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
    case template.LOAD_SELECTED_TEMPLATE: {
      return {
        ...state,
        selectedTemplateId: action.payload
      };
    }
    case template.TEMPLATE_FILTER_UPDATE: {
      return {
        ...state,
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
        loading: false
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
    case template.UPDATE_TEMPLATE: {
      return adapter.updateOne({ id: action.payload.id, changes: action.payload }, state);
    }
    case template.SET_TEMPLATE_GROUP_SUCCESS: {
      return adapter.updateOne({
        id: action.payload.id,
        changes: {
          tags: action.payload.tags
        }
      }, state);
    }
    case template.RESET_TEMPLATE_GROUP_SUCCESS: {
      return adapter.updateOne({
        id: action.payload.id,
        changes: {
          tags: action.payload.tags.filter(_ => _.key !== TemplateTagKeys.group)
        }
      }, state);
    }
    default: {
      return state;
    }
  }
}


export function vmCreationListReducer(
  state = initialVmCreationTemplatesState,
  action: template.Actions
): VmCreationTemplatesState {
  switch (action.type) {
    case template.DIALOG_TEMPLATE_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }
    case template.DIALOG_LOAD_TEMPLATE_REQUEST: {
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedZoneId: action.payload
        }
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

export const getVmCreationListState = createSelector(
  getTemplatesState,
  state => state.vmCreationList
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
  selectEntities,
  getSelectedId,
  (entities, selectedId) => entities[selectedId]
);

export const getVMTemplate = createSelector(
  selectEntities,
  fromVMs.getSelectedVM,
  (entities, vm) => entities[vm.isoId]
);

export const getSelectedTemplateTags = createSelector(
  getTemplatesState,
  getSelectedId,
  (
    state,
    selectedId
  ) => state.list.entities[selectedId] && state.list.entities[selectedId].tags
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

export const vmCreationListFilters = createSelector(
  getVmCreationListState,
  state => state.filters
);

export const vmCreationListViewMode = createSelector(
  vmCreationListFilters,
  state => state.selectedViewMode
);

export const vmCreationListSelectedTypes = createSelector(
  vmCreationListFilters,
  state => state.selectedTypes
);

export const vmCreationListSelectedOsFamilies = createSelector(
  vmCreationListFilters,
  state => state.selectedOsFamilies
);

export const vmCreationListSelectedGroups = createSelector(
  vmCreationListFilters,
  state => state.selectedGroups
);

export const vmCreationListQuery = createSelector(
  vmCreationListFilters,
  state => state.query
);

export const selectByViewModeAndAccounts = createSelector(
  selectAll,
  filterSelectedViewMode,
  fromAccounts.selectEntities,
  filterSelectedAccountIds,
  (templates, viewMode, accountEntities, selectedAccountIds) => {
    const viewModeStr = viewMode === TemplateResourceType.iso
      ? viewMode.toUpperCase()
      : viewMode;
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
  filters,
  getUserAccount,
  fromTemplateGroups.selectEntities,
  (
    templates,
    osTypesEntities,
    listFilters,
    user,
    templateGroupEntities
  ) => {

    const osFamiliesMap = listFilters.selectedOsFamilies.reduce((m, i) => ({
      ...m,
      [i]: i
    }), {});
    const zonesMap = listFilters.selectedZones.reduce((m, i) => ({ ...m, [i]: i }), {});
    const typesMap = listFilters.selectedTypes.reduce((m, i) => ({ ...m, [i]: i }), {});
    const groupsMap = listFilters.selectedGroups.reduce((m, i) => ({ ...m, [i]: i }), {});
    const queryLower = listFilters.query && listFilters.query.toLowerCase();

    const selectedTypesFilter = ((template: BaseTemplateModel) => {
      const featuredFilter = (typesMap[TemplateFilters.featured] && template.isFeatured);
      const selfFilter = !!typesMap[TemplateFilters.self] && (template.account === user.name);
      return !listFilters.selectedTypes.length || featuredFilter || selfFilter;
    });

    const selectedOsFamiliesFilter = (template: BaseTemplateModel) => {
      const osFamily = osTypesEntities[template.osTypeId]
        ? osTypesEntities[template.osTypeId].osFamily
        : '';
      return !listFilters.selectedOsFamilies.length || !!osFamiliesMap[osFamily];
    };

    const selectedZonesFilter = (template: BaseTemplateModel) => {
      return !listFilters.selectedZones.length || !!zonesMap[template.zoneId];
    };

    const selectedGroupsFilter = (template: BaseTemplateModel) => {
      if (listFilters.selectedGroups.length) {
        const tag = template.tags.find(_ => _.key === TemplateTagKeys.group);
        const group = tag && tag.value;
        const showGeneral = listFilters.selectedGroups.indexOf(DefaultTemplateGroupId) !== -1;
        return !!groupsMap[group]
          || (showGeneral && (!templateGroupEntities[group] || !group));
      }
      return true;
    };

    const queryFilter = (template: BaseTemplateModel) => !listFilters.query || template.name.toLowerCase()
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

export const selectTemplatesForVmCreation = createSelector(
  selectAll,
  getUserAccount,
  fromOsTypes.selectEntities,
  vmCreationListFilters,
  fromTemplateGroups.selectEntities,
  (templates, user, osTypesEntities, vmFilters, templateGroupEntities) => {
    const typesMap = vmFilters.selectedTypes
      .reduce((m, i) => ({ ...m, [i]: i }), {});
    const osFamiliesMap = vmFilters.selectedOsFamilies
      .reduce((m, i) => ({ ...m, [i]: i }), {});
    const groupsMap = vmFilters.selectedGroups
      .reduce((m, i) => ({ ...m, [i]: i }), {});

    const viewModeStr = vmFilters.selectedViewMode === TemplateResourceType.iso
      ? vmFilters.selectedViewMode.toUpperCase()
      : vmFilters.selectedViewMode;
    const selectedViewModeFilter = (template: BaseTemplateModel) => {
      return viewModeStr === template.resourceType;
    };

    const selectedTypesFilter = ((template: BaseTemplateModel) => {
      const featuredFilter = (typesMap[TemplateFilters.featured] && template.isFeatured);
      const selfFilter = !!typesMap[TemplateFilters.self]
        && (template.account === user.name && template.domainId === user.domainid);
      return !vmFilters.selectedTypes.length || featuredFilter || selfFilter;
    });

    const selectedOsFamiliesFilter = (template: BaseTemplateModel) => {
      const osFamily = osTypesEntities[template.osTypeId]
        ? osTypesEntities[template.osTypeId].osFamily
        : '';
      return !vmFilters.selectedOsFamilies.length || !!osFamiliesMap[osFamily];
    };

    const selectedZoneFilter = (template: BaseTemplateModel) => {
      return template.zoneId === vmFilters.selectedZoneId;
    };

    const selectedGroupsFilter = (template: BaseTemplateModel) => {
      if (vmFilters.selectedGroups.length) {
        const tag = template.tags.find(_ => _.key === TemplateTagKeys.group);
        const group = tag && tag.value;
        const showGeneral = vmFilters.selectedGroups.indexOf(DefaultTemplateGroupId) !== -1;
        return !!groupsMap[group]
          || (showGeneral && (!templateGroupEntities[group] || !group));
      }
      return true;
    };

    const queryLower = vmFilters.query && vmFilters.query.toLowerCase();
    const queryFilter = (template: BaseTemplateModel) => !vmFilters.query || template.name.toLowerCase()
        .includes(queryLower) ||
      template.displayText.toLowerCase().includes(queryLower);

    const availableTemplatesFilter = (template: BaseTemplateModel) => template.isReady;

    return templates.filter((template) =>
      availableTemplatesFilter(template)
      && selectedViewModeFilter(template)
      && selectedTypesFilter(template)
      && selectedOsFamiliesFilter(template)
      && selectedZoneFilter(template)
      && selectedGroupsFilter(template)
      && queryFilter(template));
  }
);
