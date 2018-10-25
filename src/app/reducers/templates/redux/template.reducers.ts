import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  templateFilters,
  templateResourceType,
} from '../../../template/shared/base-template.service';
import { BaseTemplateModel, resourceType } from '../../../template/shared/base-template.model';
import { templateTagKeys } from '../../../shared/services/tags/template-tag-keys';
import * as fromAuth from '../../auth/redux/auth.reducers';
import { defaultTemplateGroupId } from '../../../shared/models/config/image-group.model';
import { Utils } from '../../../shared/services/utils/utils.service';

import { configSelectors } from '../../../root-store';
import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as fromOsTypes from './ostype.reducers';
import * as templateActions from './template.actions';
import * as vmActions from '../../vm/redux/vm.actions';

export interface ListState extends EntityState<BaseTemplateModel> {
  loading: boolean;
  selectedTemplateId: string | null;
  filters: {
    selectedViewMode: string;
    selectedTypes: string[];
    selectedOsFamilies: string[];
    selectedZones: string[];
    selectedGroupings: any[];
    selectedGroups: string[];
    selectedAccountIds: string[];
    query: string;
  };
}

export interface VmCreationTemplatesState {
  filters: {
    selectedViewMode: string;
    selectedTypes: string[];
    selectedOsFamilies: string[];
    selectedGroups: string[];
    selectedZoneId: string;
    query: string;
  };
}

export const adapter: EntityAdapter<BaseTemplateModel> = createEntityAdapter<BaseTemplateModel>({
  selectId: (item: BaseTemplateModel) => item.id,
  sortComparer: Utils.sortByName,
});

const initialListState: ListState = adapter.getInitialState({
  loading: false,
  selectedTemplateId: null,
  filters: {
    selectedViewMode: templateResourceType.template,
    selectedTypes: [],
    selectedOsFamilies: [],
    selectedZones: [],
    selectedGroupings: [],
    selectedGroups: [],
    selectedAccountIds: [],
    query: '',
  },
});

const initialVmCreationTemplatesState: VmCreationTemplatesState = {
  filters: {
    selectedViewMode: templateResourceType.template,
    selectedTypes: [],
    selectedOsFamilies: [],
    selectedGroups: [],
    selectedZoneId: null,
    query: '',
  },
};

export interface TemplatesState {
  list: ListState;
  vmCreationList: VmCreationTemplatesState;
}

export const templateReducers = {
  list: listReducer,
  vmCreationList: vmCreationListReducer,
};

export function listReducer(state = initialListState, action: templateActions.Actions): ListState {
  switch (action.type) {
    case templateActions.LOAD_TEMPLATE_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case templateActions.TEMPLATE_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case templateActions.LOAD_TEMPLATE_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false,
      };
    }
    case templateActions.TEMPLATE_CREATE_SUCCESS: {
      return adapter.addOne(action.payload, state);
    }
    case templateActions.TEMPLATE_REGISTER_SUCCESS: {
      return adapter.addOne(action.payload, state);
    }
    case templateActions.TEMPLATE_REMOVE_SUCCESS: {
      return adapter.removeOne(action.payload.id, state);
    }
    case templateActions.LOAD_SELECTED_TEMPLATE: {
      return {
        ...state,
        selectedTemplateId: action.payload,
      };
    }
    case templateActions.UPDATE_TEMPLATE: {
      return adapter.updateOne({ id: action.payload.id, changes: action.payload }, state);
    }
    case templateActions.SET_TEMPLATE_GROUP_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: {
            tags: action.payload.tags,
          },
        },
        state,
      );
    }
    case templateActions.RESET_TEMPLATE_GROUP_SUCCESS: {
      return adapter.updateOne(
        {
          id: action.payload.id,
          changes: {
            tags: action.payload.tags.filter(_ => _.key !== templateTagKeys.group),
          },
        },
        state,
      );
    }
    default: {
      return state;
    }
  }
}

export function vmCreationListReducer(
  state = initialVmCreationTemplatesState,
  action: templateActions.Actions | vmActions.Actions,
): VmCreationTemplatesState {
  switch (action.type) {
    case templateActions.DIALOG_TEMPLATE_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case vmActions.VM_FORM_INIT: {
      return {
        ...initialVmCreationTemplatesState,
      };
    }
    default: {
      return state;
    }
  }
}

export const getTemplatesState = createFeatureSelector<TemplatesState>('templates');

export const getTemplatesEntitiesState = createSelector(getTemplatesState, state => state.list);

export const getVmCreationListState = createSelector(
  getTemplatesState,
  state => state.vmCreationList,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getTemplatesEntitiesState,
);

export const isLoading = createSelector(getTemplatesEntitiesState, state => state.loading);

export const filters = createSelector(getTemplatesEntitiesState, state => state.filters);

export const getSelectedId = createSelector(
  getTemplatesEntitiesState,
  state => state.selectedTemplateId,
);

export const getSelectedTemplate = createSelector(
  selectEntities,
  getSelectedId,
  (entities, selectedId) => entities[selectedId],
);

export const getVMTemplate = createSelector(
  selectEntities,
  fromVMs.getSelectedVM,
  (entities, vm) => vm && entities[vm.isoid],
);

export const getSelectedTemplateTags = createSelector(
  getTemplatesState,
  getSelectedId,
  (state, selectedId) => state.list.entities[selectedId] && state.list.entities[selectedId].tags,
);

export const filterSelectedViewMode = createSelector(filters, state => state.selectedViewMode);
export const filterSelectedGroupings = createSelector(filters, state => state.selectedGroupings);

export const filterSelectedTypes = createSelector(filters, state => state.selectedTypes);

export const filterSelectedZones = createSelector(filters, state => state.selectedZones);

export const filterSelectedGroups = createSelector(filters, state => state.selectedGroups);

export const filterSelectedAccountIds = createSelector(filters, state => state.selectedAccountIds);

export const filterSelectedOsFamilies = createSelector(filters, state => state.selectedOsFamilies);

export const filterQuery = createSelector(filters, state => state.query);

export const vmCreationListFilters = createSelector(getVmCreationListState, state => state.filters);

export const vmCreationListViewMode = createSelector(
  vmCreationListFilters,
  state => state.selectedViewMode,
);

export const vmCreationListSelectedTypes = createSelector(
  vmCreationListFilters,
  state => state.selectedTypes,
);

export const vmCreationListSelectedOsFamilies = createSelector(
  vmCreationListFilters,
  state => state.selectedOsFamilies,
);

export const vmCreationListSelectedGroups = createSelector(
  vmCreationListFilters,
  state => state.selectedGroups,
);

export const vmCreationListQuery = createSelector(vmCreationListFilters, state => state.query);

export const selectByViewModeAndAccounts = createSelector(
  selectAll,
  filterSelectedViewMode,
  fromAccounts.selectEntities,
  filterSelectedAccountIds,
  (templates, viewMode, accountEntities, selectedAccountIds) => {
    const selectedViewModeFilter = (template: BaseTemplateModel) => {
      return viewMode === resourceType(template);
    };

    const accountDomainMap = selectedAccountIds
      .filter(id => accountEntities[id])
      .reduce((m, id) => {
        const acc = accountEntities[id];
        return { ...m, [`${acc.name}_${acc.domainid}`]: acc };
      }, {});

    const selectedAccountIdsFilter = template =>
      !selectedAccountIds.length || accountDomainMap[`${template.account}_${template.domainid}`];

    return templates.filter(
      (template: BaseTemplateModel) =>
        selectedViewModeFilter(template) && selectedAccountIdsFilter(template),
    );
  },
);

export const selectFilteredTemplates = createSelector(
  selectByViewModeAndAccounts,
  fromOsTypes.selectEntities,
  filters,
  fromAuth.getUserAccount,
  configSelectors.get('imageGroups'),
  (templates, osTypesEntities, listFilters, user, imageGroups) => {
    const osFamiliesMap = listFilters.selectedOsFamilies.reduce(
      (m, i) => ({
        ...m,
        [i]: i,
      }),
      {},
    );
    const zonesMap = listFilters.selectedZones.reduce((m, i) => ({ ...m, [i]: i }), {});
    const typesMap = listFilters.selectedTypes.reduce((m, i) => ({ ...m, [i]: i }), {});
    const groupsMap = listFilters.selectedGroups.reduce((m, i) => ({ ...m, [i]: i }), {});
    const queryLower = listFilters.query && listFilters.query.toLowerCase();

    const selectedTypesFilter = (template: BaseTemplateModel) => {
      const selfFilter =
        !!typesMap[templateFilters.self] &&
        (template.account === user.name && template.domainid === user.domainid);
      const featuredFilter = typesMap[templateFilters.featured] && template.isfeatured;
      const communityFilter =
        typesMap[templateFilters.community] && template.ispublic && !template.isfeatured;
      return !listFilters.selectedTypes.length || selfFilter || featuredFilter || communityFilter;
    };

    const selectedOsFamiliesFilter = (template: BaseTemplateModel) => {
      const osFamily = osTypesEntities[template.ostypeid]
        ? osTypesEntities[template.ostypeid].osFamily
        : '';
      return !listFilters.selectedOsFamilies.length || !!osFamiliesMap[osFamily];
    };

    const selectedZonesFilter = (template: BaseTemplateModel) => {
      return !listFilters.selectedZones.length || !!zonesMap[template.zoneid];
    };

    const selectedGroupsFilter = (template: BaseTemplateModel) => {
      if (listFilters.selectedGroups.length) {
        const tag = template.tags.find(_ => _.key === templateTagKeys.group);
        const groupId = tag && tag.value;
        const showGeneral = listFilters.selectedGroups.indexOf(defaultTemplateGroupId) !== -1;
        const imageGroup = imageGroups.find(group => group.id === groupId);
        return !!groupsMap[groupId] || (showGeneral && (!imageGroup || !groupId));
      }
      return true;
    };

    const queryFilter = (template: BaseTemplateModel) =>
      !listFilters.query ||
      template.name.toLowerCase().includes(queryLower) ||
      template.displaytext.toLowerCase().includes(queryLower);

    return templates.filter(
      template =>
        selectedZonesFilter(template) &&
        selectedTypesFilter(template) &&
        selectedGroupsFilter(template) &&
        selectedOsFamiliesFilter(template) &&
        queryFilter(template),
    );
  },
);

export const selectTemplatesForAction = createSelector(
  selectAll,
  fromAuth.getUserAccount,
  fromOsTypes.selectEntities,
  vmCreationListFilters,
  configSelectors.get('imageGroups'),
  (templates, user, osTypesEntities, vmFilters, imageGroups) => {
    const typesMap = vmFilters.selectedTypes.reduce((m, i) => ({ ...m, [i]: i }), {});
    const osFamiliesMap = vmFilters.selectedOsFamilies.reduce((m, i) => ({ ...m, [i]: i }), {});
    const groupsMap = vmFilters.selectedGroups.reduce((m, i) => ({ ...m, [i]: i }), {});

    const selectedTypesFilter = (template: BaseTemplateModel) => {
      const selfFilter =
        !!typesMap[templateFilters.self] &&
        (template.account === user.name && template.domainid === user.domainid);
      const featuredFilter = typesMap[templateFilters.featured] && template.isfeatured;
      const communityFilter =
        typesMap[templateFilters.community] && template.ispublic && !template.isfeatured;
      return !vmFilters.selectedTypes.length || selfFilter || featuredFilter || communityFilter;
    };

    const selectedOsFamiliesFilter = (template: BaseTemplateModel) => {
      const osFamily = osTypesEntities[template.ostypeid]
        ? osTypesEntities[template.ostypeid].osFamily
        : '';
      return !vmFilters.selectedOsFamilies.length || !!osFamiliesMap[osFamily];
    };

    const selectedGroupsFilter = (template: BaseTemplateModel) => {
      if (vmFilters.selectedGroups.length) {
        const tag = template.tags.find(_ => _.key === templateTagKeys.group);
        const groupId = tag && tag.value;
        const showGeneral = vmFilters.selectedGroups.indexOf(defaultTemplateGroupId) !== -1;
        const imageGroup = imageGroups.find(group => group.id === groupId);
        return !!groupsMap[groupId] || (showGeneral && (!imageGroup || !groupId));
      }
      return true;
    };

    const queryLower = vmFilters.query && vmFilters.query.toLowerCase();
    const queryFilter = (template: BaseTemplateModel) =>
      !vmFilters.query ||
      template.name.toLowerCase().includes(queryLower) ||
      template.displaytext.toLowerCase().includes(queryLower);

    const availableTemplatesFilter = (template: BaseTemplateModel) => template.isready;

    return templates.filter(
      template =>
        availableTemplatesFilter(template) &&
        selectedTypesFilter(template) &&
        selectedOsFamiliesFilter(template) &&
        selectedGroupsFilter(template) &&
        queryFilter(template),
    );
  },
);

export const selectTemplatesForIsoAttachment = createSelector(
  selectTemplatesForAction,
  fromAuth.getUserAccount,
  fromVMs.getSelectedVM,
  (templates, account, vm) => {
    const selectedZoneFilter = (template: BaseTemplateModel) => {
      return template.zoneid === vm.zoneid || template.crossZones;
    };

    const selectedViewModeFilter = (template: BaseTemplateModel) => {
      return resourceType(template) === templateResourceType.iso;
    };

    const currentAccountFilter = (template: BaseTemplateModel) => {
      return (
        (account && template.account === account.name && template.domainid === account.domainid) ||
        template.isfeatured ||
        template.ispublic
      );
    };

    return templates.filter(
      template =>
        selectedZoneFilter(template) &&
        selectedViewModeFilter(template) &&
        currentAccountFilter(template),
    );
  },
);

const filterForVmCreation = (templates, zoneId, account) => {
  const selectedZoneFilter = (template: BaseTemplateModel) => {
    return template.zoneid === zoneId || template.crossZones;
  };

  const currentAccountFilter = (template: BaseTemplateModel) => {
    return (
      (account && template.account === account.name && template.domainid === account.domainid) ||
      template.isfeatured ||
      template.ispublic
    );
  };

  return templates.filter(
    template => selectedZoneFilter(template) && currentAccountFilter(template),
  );
};

const filterForVmCreationWithFilter = (templates, zoneId, account, filter) => {
  const selectedViewModeFilter = (template: BaseTemplateModel) => {
    return filter.selectedViewMode === resourceType(template);
  };

  return filterForVmCreation(templates, zoneId, account).filter(selectedViewModeFilter);
};

export const selectFilteredTemplatesForVmCreation = createSelector(
  selectTemplatesForAction,
  fromVMs.getVmCreationZoneId,
  fromAuth.getUserAccount,
  vmCreationListFilters,
  filterForVmCreationWithFilter,
);

export const numOfTemplatesReadyForVmCreation = createSelector(
  selectAll,
  fromVMs.getVmCreationZoneId,
  fromAuth.getUserAccount,
  (templates, zoneId, account) => filterForVmCreation(templates, zoneId, account).length,
);
