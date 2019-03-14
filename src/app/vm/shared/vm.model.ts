import { SecurityGroup } from '../../security-group/sg.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { BaseModel, NIC, OsType, Volume } from '../../shared/models';
import { AffinityGroup } from '../../shared/models/affinity-group.model';
import { BaseTemplateModel } from '../../template/shared';
import { Utils } from '../../shared/services/utils/utils.service';

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
  Expunging = 'Expunging',
}

export const vmResourceType = 'UserVm';

export interface VirtualMachine extends BaseModel, Taggable {
  id: string;
  displayname: string;
  name: string;
  account: string;
  domain: string;
  domainid: string;
  group: string;
  // Status
  state: VmState;
  // Service Offering
  serviceofferingid: string;
  serviceofferingname: string;
  cpunumber: number;
  cpuspeed: number;
  memory: number;
  volumes: Volume[];
  // IP addresses
  nic: NIC[];
  // Security Group
  securitygroup: SecurityGroup[];
  // Affinity Group
  affinitygroup: AffinityGroup[];
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
  userdata?: string;
}

export function isVMUserDataValid(userData: string): boolean {
  if (!userData) {
    return true;
  }
  const size = Utils.sizeOfBase64String(Utils.encodeStringToBase64(userData));
  return size < 32 * 1024;
}
