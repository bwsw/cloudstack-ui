import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Route } from '../models';
import { appNavRoutes } from '../routes';
import { getUrl } from '../../../root-store/router/router.selectors';
import * as flatten from 'lodash/flatten';
import { ConfigActionTypes } from '../../../root-store/config/config.actions';

export interface State {
  routes: Route[];
}

export const initialState: State = {
  routes: appNavRoutes,
};

export function reducer(state = initialState, action: any): State {
  switch (action.type) {
    case ConfigActionTypes.LoadConfigSuccess: {
      if (action.payload.config.extensions.vmLogs) {
        return {
          routes: state.routes.map(route => {
            if (route.id === 'virtual-machines') {
              return {
                ...route,
                subroutes: route.subroutes.concat({
                  text: 'NAVIGATION_SIDEBAR.LOGS',
                  path: '/logs',
                  icon: 'mdi-text',
                  routeId: 'virtual-machines',
                }),
              };
            }

            return route;
          }),
        };
      }

      break;
    }

    default: {
      return state;
    }
  }
}

export const getNavMenuState = createFeatureSelector<State>('navMenu');

export const getRoutes = createSelector(getNavMenuState, state => state.routes);

const getCurrentSubroutePath = createSelector(getUrl, url => url.match(/^\/[A-Za-z-]*/)[0]);

const getAllSubroutes = createSelector(getRoutes, routes =>
  flatten(routes.map(route => route.subroutes)),
);

const getCurrentSubroute = createSelector(
  getCurrentSubroutePath,
  getAllSubroutes,
  (path, subroutes) => subroutes.find(subroute => subroute && subroute.path === path),
);

export const getCurrentRoute = createSelector(getRoutes, getCurrentSubroute, (routes, subroute) =>
  routes.find(route => subroute && route.id === subroute.routeId),
);

export const getSubroutes = createSelector(getCurrentRoute, route => route.subroutes);
