import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { VmSnapshot } from '../../../shared/models/vm-snapshot.model';
import moment = require('moment');

export interface VmSnapshotsState extends EntityState<VmSnapshot> {
  isLoading: boolean;
}

const sortByCreationDate = (a: VmSnapshot, b: VmSnapshot) => {
  const aDate = moment(a.created).toDate();
  const bDate = moment(b.created).toDate();

  return aDate < bDate ? 1 : -1;
};

export const adapter: EntityAdapter<VmSnapshot> = createEntityAdapter<VmSnapshot>({
  selectId: (vmSnapshot: VmSnapshot) => vmSnapshot.id,
  sortComparer: sortByCreationDate,
});

export const initialState: VmSnapshotsState = adapter.getInitialState({
  isLoading: false,
});
