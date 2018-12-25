import { SnapshotType } from '../../shared/models';

export interface Filters {
  accounts: string[];
  vmIds: string[];
  date: Date;
  query: string | undefined;
  volumeSnapshotTypes: SnapshotType[];
}
