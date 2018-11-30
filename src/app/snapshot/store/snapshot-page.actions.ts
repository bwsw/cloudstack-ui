import { Action } from '@ngrx/store';
import { Filters } from '../models/filters.model';
import { SnapshotPageViewMode } from '../types';

export enum SnapshotPageActionTypes {
  Select = '[Snapshot page] Select snapshot',
  UpdateViewMode = '[Snapshot page] Update snapshot page view mode',
  UpdateFilters = '[Snapshot page] Update snapshot filters',
  UpdateGroupings = '[Snapshot page] Update snapshots groupings',
}

export class Select implements Action {
  readonly type = SnapshotPageActionTypes.Select;

  constructor(readonly payload: { id: string }) {}
}

export class UpdateViewMode implements Action {
  readonly type = SnapshotPageActionTypes.UpdateViewMode;

  constructor(readonly payload: { mode: SnapshotPageViewMode }) {}
}

export class UpdateFilters implements Action {
  readonly type = SnapshotPageActionTypes.UpdateFilters;

  constructor(readonly payload: Partial<Filters>) {}
}

export class UpdateGroupings implements Action {
  readonly type = SnapshotPageActionTypes.UpdateGroupings;

  constructor(readonly payload: { groupings: any }) {}
}

export type SnapshotPageActionsUnion = Select | UpdateViewMode | UpdateFilters | UpdateGroupings;
