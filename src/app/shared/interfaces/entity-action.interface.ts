import { Action } from '@ngrx/store';

export interface EntityAction {
  icon: string;
  text: string;
  disabled: boolean;
  visible: boolean;
  actionCreator: () => Action;
}
