import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  OpenAppNav = '[SectionNav] Open AppNav',
  CloseAppNav = '[AppNav] Close AppNav',
  OpenSidebar = '[Layout] Open Sidebar',
  CloseSidebar = '[Layout] Close Sidebar',
}

export class OpenAppNav implements Action {
  readonly type = LayoutActionTypes.OpenAppNav;
}

export class CloseAppNav implements Action {
  readonly type = LayoutActionTypes.CloseAppNav;
}

export class OpenSidebar implements Action {
  readonly type = LayoutActionTypes.OpenSidebar;
}

export class CloseSidebar implements Action {
  readonly type = LayoutActionTypes.CloseSidebar;
}

export type LayoutActionsUnion = OpenAppNav | CloseAppNav | OpenSidebar | CloseSidebar;
