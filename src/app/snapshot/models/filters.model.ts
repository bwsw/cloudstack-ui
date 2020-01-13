import { SnapshotType } from '../../shared/models';

export interface Filters {
  accounts: string[];
  vmIds: string[];
  // id of vms with volume
  volumeVmIds: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  query: string | undefined;
  volumeSnapshotTypes: SnapshotType[];
}
