import { SecurityGroup } from '../../security-group/sg.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import {
  BaseModelInterface, InstanceGroup, NIC, OsType, ServiceOffering, Tag,
  Volume
} from '../../shared/models';
import { AffinityGroup } from '../../shared/models/affinity-group.model';
import { VirtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';
import { BaseTemplateModel } from '../../template/shared';


enum AuthModeType {
  HTTP = 'http'
}

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

export const getPort = (vm: VirtualMachine) => {
  const portTag = vm.tags.find(tag => tag.key === VirtualMachineTagKeys.portToken);
  return portTag && portTag.value || '80';
};

export const getPath = (vm: VirtualMachine) => {
  const pathTag = vm.tags.find(tag => tag.key === VirtualMachineTagKeys.pathToken);
  return pathTag && pathTag.value || '';
};

export const getProtocol = (vm: VirtualMachine) => {
  const protocolTag = vm.tags.find(
    tag => tag.key === VirtualMachineTagKeys.protocolToken);
  return protocolTag && protocolTag.value || 'http';
};

export const getLogin = (vm: VirtualMachine) => {
  const loginTag = vm.tags.find(tag => tag.key === VirtualMachineTagKeys.loginToken);
  return loginTag && loginTag.value;
};

export const getPassword = (vm: VirtualMachine) => {
  const passwordTag = vm.tags.find(
    tag => tag.key === VirtualMachineTagKeys.httpPasswordToken);
  return passwordTag && passwordTag.value;
};

export const isHttpAuthMode = (vm: VirtualMachine) => {
  const authModeTag = vm.tags.find(
    tag => tag.key === VirtualMachineTagKeys.authModeToken);
  const authMode = authModeTag && authModeTag.value;
  const mode = authMode && authMode.split(',').find(m => m.toLowerCase() === AuthModeType.HTTP);
  return mode && vm.state === VmState.Running;
};


export interface VirtualMachine extends BaseModelInterface, Taggable {
  id: string;
  displayname: string;
  name: string;
  account: string;
  domain: string;
  domainid: string;
  // Status
  state: VmState;
  // Service Offering
  serviceOffering: ServiceOffering;
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
  pending: boolean;
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
  tags: Array<Tag>;
  instanceGroup: InstanceGroup;
}
