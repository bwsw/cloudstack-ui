import {
  AffinityGroup,
  DiskOffering,
  InstanceGroup,
  SSHKeyPair,
  Zone,
} from '../../../shared/models';
import { BaseTemplateModel } from '../../../template/shared';
import { VmCreationSecurityGroupData } from '../security-group/vm-creation-security-group-data';
import { ComputeOfferingViewModel } from '../../view-models';

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
  rootDiskSize: number;
  rootDiskMinSize: number;
  securityGroupData: VmCreationSecurityGroupData;
  serviceOffering: ComputeOfferingViewModel;
  sshKeyPair: SSHKeyPair | NotSelected;
  template: BaseTemplateModel;
  zone: Zone;
  agreement: boolean;
}
