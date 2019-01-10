import { SnapshotType } from '../../shared/models';

export interface Filters {
  accounts: string[];
  vmIds: string[];
  // vm ids with volume
  volumeVmIds: string[];
  date: Date;
  query: string | undefined;
  volumeSnapshotTypes: SnapshotType[];
}
