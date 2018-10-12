import { SecurityGroup } from '../../security-group/sg.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { BaseModel, NIC, OsType, Volume } from '../../shared/models';
import { AffinityGroup } from '../../shared/models/affinity-group.model';
import { BaseTemplateModel } from '../../template/shared';
import { VirtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';

export enum VmState {
  Running = 'Running',
  Stopped = 'Stopped',
  Error = 'Error',
  Destroyed = 'Destroyed',
  Expunged = 'Expunged',
  InProgress = 'In-progress',
  Stopping = 'Stopping',
  // custom states
  Deploying = 'Deploying',
  Expunging = 'Expunging'
}

export const VmResourceType = 'UserVm';

export interface VirtualMachine extends BaseModel, Taggable {
  id: string;
  displayname: string;
  name: string;
  account: string;
  domain: string;
  domainid: string;
  // Status
  state: VmState;
  // Service Offering
  serviceofferingid: string;
  serviceofferingname: string;
  cpunumber: number;
  cpuspeed: number;
  memory: number;
  volumes: Array<Volume>;
  // IP addresses
  nic: Array<NIC>;
  // Security Group
  securitygroup: Array<SecurityGroup>;
  // Affinity Group
  affinitygroup: Array<AffinityGroup>;
  // Zone
  zoneid: string;
  zonename: string;
  // Template
  template: BaseTemplateModel;
  templateid: string;
  templatename: string;
  isoid: string;
  osType: OsType;
  guestosid: string;
  // CUSTOM
  pending?: boolean;
  // statistics
  cpuused: string;
  networkkbsread: number;
  networkkbswrite: number;
  diskkbsread: number;
  diskkbswrite: number;
  diskioread: number;
  diskiowrite: number;
  // misc
  created: string;
  keypair: string;
  password: string;
  passwordenabled: boolean;
}

export const getInstanceGroupName = (vm: VirtualMachine) => {
  const instanceGroup = vm && vm.tags.find(tag => tag.key === VirtualMachineTagKeys.group);
  return instanceGroup && instanceGroup.value;
};
