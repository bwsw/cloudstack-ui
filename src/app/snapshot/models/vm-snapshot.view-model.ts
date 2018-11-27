import { VmState } from '../../vm';

export interface VmSnapshotViewModel {
  id: string;
  state: string;
  name: string;
  vmName: string;
  vmState: VmState;
  created: Date;
  // necessary for grouping
  account: string;
  domain: string;
}
