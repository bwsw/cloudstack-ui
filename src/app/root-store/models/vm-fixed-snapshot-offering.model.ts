import { VirtualMachine } from '../../vm';
import { VmSnapshotOffering } from './vm-snapshot-offering.model';

export class VmFixedSnapshotOffering extends VmSnapshotOffering {
  public constructor(private computeOfferingId: string) {
    super();
  }

  public toString(): string {
    return JSON.stringify({
      id: this.computeOfferingId,
    });
  }

  public isValidForVm(vm: VirtualMachine): boolean {
    return this.computeOfferingId === vm.serviceofferingid;
  }
}
