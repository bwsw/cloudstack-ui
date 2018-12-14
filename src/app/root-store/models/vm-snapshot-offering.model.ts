import { VirtualMachine } from '../../vm';

interface CustomOfferingParams {
  memory: number;
}

/**
 * Interface for storing the compute offering that the VM has at time of the VM snapshot creation
 */
interface OfferingOnCreation {
  id: string;
  custom?: CustomOfferingParams;
}

export const vmSnapshotOfferingTagKey = 'csui.vm-snapshot.offering-on-creation';

/**
 * This class generates a tag value for VM snapshots and validates
 * if the offering at the time of the VM snapshot creation is equal to the current VM offering.
 */
export class VmSnapshotOffering {
  protected constructor(
    private computeOfferingId: string,
    private customOffering: CustomOfferingParams | undefined,
  ) {}

  public static create(vm: VirtualMachine, isCustomized: boolean): VmSnapshotOffering {
    const customOffering: CustomOfferingParams =
      isCustomized == null ? undefined : { memory: vm.memory };
    return new VmSnapshotOffering(vm.serviceofferingid, customOffering);
  }

  public static createFromTagValue(value: string): VmSnapshotOffering {
    const struct: OfferingOnCreation = JSON.parse(value);
    return new VmSnapshotOffering(struct.id, struct.custom);
  }

  public toString(): string {
    const struct: OfferingOnCreation = {
      id: this.computeOfferingId,
      custom: this.customOffering,
    };
    return JSON.stringify(struct);
  }

  public isValidForVm(vm: VirtualMachine): boolean {
    if (this.customOffering) {
      return this.isValidForCustomOffering(vm);
    }

    return this.isValidForFixedOffering(vm);
  }

  private isValidForCustomOffering(vm: VirtualMachine): boolean {
    const isSameOffering = vm.serviceofferingid === this.computeOfferingId;
    if (!isSameOffering) {
      return false;
    }
    return this.customOffering.memory === vm.memory;
  }

  private isValidForFixedOffering(vm: VirtualMachine): boolean {
    return this.computeOfferingId === vm.serviceofferingid;
  }
}
