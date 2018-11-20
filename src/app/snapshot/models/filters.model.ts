import { SnapshotType } from '../../shared/models';

export interface Filters {
  accountsIds: string[];
  date: Date;
  query: string | undefined;
  volumeSnapshotTypes: SnapshotType[];
}
