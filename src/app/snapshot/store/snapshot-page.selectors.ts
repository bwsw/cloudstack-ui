import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SnapshotPageState, snapshotPageStoreName } from './snapshot-page.reducer';

const getSnapshotPageState = createFeatureSelector<SnapshotPageState>(snapshotPageStoreName);

export const getViewMode = createSelector(getSnapshotPageState, state => state.viewMode);
