import { LayoutActionsUnion, LayoutActionTypes } from './layout.actions';

export const featureStoreName = 'layout';

export interface LayoutState {
  showAppNav: boolean;
}

const initialState: LayoutState = {
  showAppNav: false,
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

    default: {
      return state;
    }
  }
}
