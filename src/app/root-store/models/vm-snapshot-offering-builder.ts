import { VirtualMachine } from '../../vm';
import { VmCustomSnapshotOffering } from './vm-custom-snapshot-offering.model';
import { VmFixedSnapshotOffering } from './vm-fixed-snapshot-offering.model';
import { VmSnapshotOffering } from './vm-snapshot-offering.model';

export interface CustomOfferingParams {
  cpunumber: number;
  cpuspeed: number;
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

export class VmSnapshotBuilder {
  public static create(vm: VirtualMachine, isCustomized: boolean): VmSnapshotOffering {
    if (isCustomized) {
      return new VmCustomSnapshotOffering(vm.serviceofferingid, {
        cpunumber: vm.cpunumber,
        cpuspeed: vm.cpuspeed,
        memory: vm.memory,
      });
    }

    return new VmFixedSnapshotOffering(vm.serviceofferingid);
  }

  public static createFromTagValue(value: string): VmSnapshotOffering {
    const struct: OfferingOnCreation = JSON.parse(value);

    if (struct.custom) {
      return new VmCustomSnapshotOffering(struct.id, struct.custom);
    }

    return new VmFixedSnapshotOffering(struct.id);
  }
}
