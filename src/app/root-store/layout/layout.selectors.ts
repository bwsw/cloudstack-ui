import { createFeatureSelector, createSelector } from '@ngrx/store';

import { featureStoreName, LayoutState } from './layout.reducer';

const getLayoutState = createFeatureSelector<LayoutState>(featureStoreName);

export const getShowAppNav = createSelector(
  getLayoutState,
  (state: LayoutState) => state.showAppNav,
);

export const getShowSidebar = createSelector(
  getLayoutState,
  (state: LayoutState) => state.showSidebar,
);
