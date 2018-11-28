import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { VmSnapshot } from '../../../shared/models/vm-snapshot.model';

export interface VmSnapshotsState extends EntityState<VmSnapshot> {
  isLoading: boolean;
}

export const adapter: EntityAdapter<VmSnapshot> = createEntityAdapter<VmSnapshot>({
  selectId: (vmSnapshot: VmSnapshot) => vmSnapshot.id,
});

export const initialState: VmSnapshotsState = adapter.getInitialState({
  isLoading: false,
});
