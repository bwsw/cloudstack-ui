import { SnapshotType } from '../../shared/models';

export interface Filters {
  accounts: string[];
  vmIds: string[];
  // id of vms with volume
  volumeVmIds: string[];
  date: Date;
  query: string | undefined;
  volumeSnapshotTypes: SnapshotType[];
}
