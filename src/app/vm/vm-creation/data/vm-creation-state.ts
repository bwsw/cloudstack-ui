import { AffinityGroup, DiskOffering, InstanceGroup, ServiceOffering, SSHKeyPair, Zone } from '../../../shared/models';
import { BaseTemplateModel } from '../../../template/shared';
import { KeyboardLayout } from '../keyboards/keyboards.component';
import { VmCreationSecurityGroupData } from '../security-group/vm-creation-security-group-data';

export interface NotSelected {
  name: string;
  ignore: true;
}

export interface VmCreationState {
  affinityGroup: AffinityGroup;
  affinityGroupNames: string[];
  diskOffering: DiskOffering;
  displayName: string;
  doStartVm: boolean;
  instanceGroup: InstanceGroup;
  keyboard: KeyboardLayout;
  rootDiskSize: number;
  rootDiskMinSize: number;
  securityGroupData: VmCreationSecurityGroupData;
  serviceOffering: ServiceOffering;
  sshKeyPair: SSHKeyPair | NotSelected;
  template: BaseTemplateModel;
  zone: Zone;
  agreement: boolean
}

