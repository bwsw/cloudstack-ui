import { VmState } from '../../vm';

export interface VmSnapshotViewModel {
  id: string;
  state: string;
  name: string;
  vmName: string;
  vmState: VmState;
  created: Date;
}
