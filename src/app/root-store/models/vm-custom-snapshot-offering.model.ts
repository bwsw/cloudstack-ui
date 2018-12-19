import { VirtualMachine } from '../../vm';
import { CustomOfferingParams } from './vm-snapshot-offering-builder';
import { VmSnapshotOffering } from './vm-snapshot-offering.model';

export class VmCustomSnapshotOffering extends VmSnapshotOffering {
  public constructor(
    private computeOfferingId: string,
    private customOffering: CustomOfferingParams,
  ) {
    super();
  }

  public toString(): string {
    return JSON.stringify({
      id: this.computeOfferingId,
      custom: this.customOffering,
    });
  }

  public isValidForVm(vm: VirtualMachine): boolean {
    if (vm.serviceofferingid !== this.computeOfferingId) {
      return false;
    }

    return (
      vm.memory === this.customOffering.memory &&
      vm.cpunumber >= this.customOffering.cpunumber &&
      vm.cpuspeed >= this.customOffering.cpuspeed
    );
  }
}
