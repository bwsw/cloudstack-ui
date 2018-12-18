import { VirtualMachine } from '../../vm';

export abstract class VmSnapshotOffering {
  abstract toString(): string;

  abstract isValidForVm(vm: VirtualMachine): boolean;
}
