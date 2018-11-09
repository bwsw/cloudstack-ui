import { st } from '@angular/core/src/render3';
import { LayoutActionsUnion, LayoutActionTypes } from './layout.actions';

export const featureStoreName = 'layout';

export interface LayoutState {
  showAppNav: boolean;
  showSidebar: boolean;
}

const initialState: LayoutState = {
  showAppNav: false,
  showSidebar: false,
};

export function reducer(state = initialState, action: LayoutActionsUnion) {
  switch (action.type) {
    case LayoutActionTypes.OpenAppNav: {
      return {
        ...state,
        showAppNav: true,
      };
    }

    case LayoutActionTypes.CloseAppNav: {
      return {
        ...state,
        showAppNav: false,
      };
    }

    case LayoutActionTypes.OpenSidebar: {
      return {
        ...state,
        showSidebar: true,
      };
    }

    case LayoutActionTypes.CloseSidebar: {
      return {
        ...state,
        showSidebar: false,
      };
    }

    default: {
      return state;
    }
  }
}
