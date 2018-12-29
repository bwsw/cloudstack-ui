import { SnapshotType } from '../../shared/models';

export interface Filters {
  accounts: string[];
  vmIds: string[];
  volumeVmIds: string[];
  date: Date;
  query: string | undefined;
  volumeSnapshotTypes: SnapshotType[];
}
