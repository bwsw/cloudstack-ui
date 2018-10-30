import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  OpenAppNav = '[SectionNav] Open AppNav',
  CloseAppNav = '[AppNav] Close AppNav',
}

export class OpenAppNav implements Action {
  readonly type = LayoutActionTypes.OpenAppNav;
}

export class CloseAppNav implements Action {
  readonly type = LayoutActionTypes.CloseAppNav;
}

export type LayoutActionsUnion = OpenAppNav | CloseAppNav;
