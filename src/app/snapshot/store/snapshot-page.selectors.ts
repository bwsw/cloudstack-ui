import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Filters } from '../models/filters.model';
import { SnapshotPageState, snapshotPageStoreName } from './snapshot-page.reducer';

const getSnapshotPageState = createFeatureSelector<SnapshotPageState>(snapshotPageStoreName);

export const getViewMode = createSelector(getSnapshotPageState, state => state.viewMode);

export const getFilters = createSelector(getSnapshotPageState, (state): Filters => state.filters);

export const getGroupings = createSelector(getSnapshotPageState, state => state.groupings);
