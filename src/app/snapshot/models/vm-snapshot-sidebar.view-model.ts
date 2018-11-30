import { VmState } from '../../vm';

export interface VmSnapshotSidebarViewModel {
  id: string;
  state: string;
  name: string;
  description: string;
  vmId: string;
  vmName: string;
  vmState: VmState;
  created: Date;
  type: string;
  current: boolean;
  parentName: string;
}
