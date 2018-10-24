import { RouterReducerState } from '@ngrx/router-store';

import { RouterStateUrl } from './custom-router-state-serializer';

export interface State {
  router: RouterReducerState<RouterStateUrl>;
}
