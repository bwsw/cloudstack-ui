import { SecurityGroup } from '../../security-group/sg.model';
import { FieldMapper, ZoneName } from '../../shared/decorators';
import {
  BaseModel,
  InstanceGroup,
  NIC,
  OsType,
  ServiceOffering,
  Tag,
  Volume
} from '../../shared/models';
import { BaseTemplateModel } from '../../template/shared';
import { AffinityGroup } from '../../shared/models/affinity-group.model';
import { Color } from '../../shared/models/color.model';


export const MAX_ROOT_DISK_SIZE_ADMIN = 200;

export interface IVmAction {
  name: string;
  commandName: string;
  nameLower: string;
  nameCaps: string;
  vmStateOnAction: string;
  vmActionCompleted: string;
  mdlIcon: string;
  confirmMessage: string;
  progressMessage: string;
  successMessage: string;
}

export enum VmState {
  Running = 'Running',
  Stopped = 'Stopped',
  Error = 'Error',
  Destroyed = 'Destroyed',
  Expunged = 'Expunged',

  // custom states
  Deploying = 'Deploying',
  Expunging = 'Expunging'
}

export enum VmAction {
  START = 'start',
  STOP = 'stop',
  REBOOT = 'reboot',
  RESTORE = 'restore',
  DESTROY = 'destroy',
  RESET_PASSWORD = 'resetPasswordFor',
  CONSOLE = 'console'
}

@ZoneName()
@FieldMapper({
  displayname: 'displayName',
  serviceofferingid: 'serviceOfferingId',
  serviceofferingname: 'serviceOfferingName',
  securitygroup: 'securityGroup',
  affinitygroup: 'affinityGroup',
  zoneid: 'zoneId',
  zonename: 'zoneName',
  templateid: 'templateId',
  templatename: 'templateName',
  guestosid: 'guestOsId',
  cpunumber: 'cpuNumber',
  cpuspeed: 'cpuSpeed',
  jobid: 'jobId',
  cpuused: 'cpuUsed',
  networkkbsread: 'networkKbsRead',
  networkkbswrite: 'networkKbsWrite',
  diskkbsread: 'diskKbsRead',
  diskkbswrite: 'diskKbsWrite',
  diskioread: 'diskIoRead',
  diskiowrite: 'diskIoWrite',
  keypair: 'keyPair',
  isoid: 'isoId'
})
export class VirtualMachine extends BaseModel {
  public static actions = Object
    .values(VmAction)
    .map(a => VirtualMachine.getAction(a));

  public static ColorDelimiter = ';';

  public id: string;
  public displayName: string;
  public name: string;
  // Status
  public state: VmState;
  // Service Offering
  public serviceOffering: ServiceOffering;
  public serviceOfferingId: string;
  public serviceOfferingName: string;
  public cpuNumber: number;
  public cpuSpeed: number;
  public memory: number;
  public volumes: Array<Volume>;
  // IP addresses
  public nic: Array<NIC>;
  // Security Group
  public securityGroup: Array<SecurityGroup>;
  // Affinity Group
  public affinityGroup: Array<AffinityGroup>;
  // Zone
  public zoneId: string;
  public zoneName: string;
  // Template
  public template: BaseTemplateModel;
  public templateId: string;
  public templateName: string;
  public isoId: string;
  public osType: OsType;
  public guestOsId: string;
  // CUSTOM
  public pending: boolean;
  // statistics
  public cpuUsed: string;
  public networkKbsRead: number;
  public networkKbsWrite: number;
  public diskKbsRead: number;
  public diskKbsWrite: number;
  public diskIoRead: number;
  public diskIoWrite: number;
  // misc
  public created: string;
  public keyPair: string;
  public password: string;
  public tags: Array<Tag>;
  public instanceGroup: InstanceGroup;

  public static getAction(action: string): IVmAction {
    const name = action.charAt(0).toUpperCase() + action.slice(1);
    const commandName = action;
    const nameLower = action.toLowerCase();
    const nameCaps = action.toUpperCase();
    const vmStateOnAction = nameCaps + '_IN_PROGRESS';
    const vmActionCompleted = nameCaps + '_DONE';
    let mdlIcon = '';
    const confirmMessage = 'CONFIRM_VM_' + nameCaps;
    const progressMessage = 'VM_' + nameCaps + '_IN_PROGRESS';
    const successMessage = nameCaps + '_DONE';
    switch (action) {
      case VmAction.START:
        mdlIcon = 'play_arrow';
        break;
      case VmAction.STOP:
        mdlIcon = 'stop';
        break;
      case VmAction.REBOOT:
        mdlIcon = 'replay';
        break;
      case VmAction.RESTORE:
        mdlIcon = 'settings_backup_restore';
        break;
      case VmAction.DESTROY:
        mdlIcon = 'delete';
        break;
      case VmAction.RESET_PASSWORD:
        mdlIcon = 'vpn_key';
        break;
      case VmAction.CONSOLE:
        mdlIcon = 'computer';
        break;
    }
    return {
      name,
      commandName,
      nameLower,
      nameCaps,
      vmStateOnAction,
      vmActionCompleted,
      mdlIcon,
      confirmMessage,
      progressMessage,
      successMessage
    };
  }

  constructor(params?: {}) {
    super(params);

    if (!this.nic || !this.nic.length) {
      this.nic = [];
    }

    if (!this.securityGroup || !this.securityGroup.length) {
      this.securityGroup = [];
    }

    for (let i = 0; i < this.nic.length; i++) {
      this.nic[i] = new NIC(this.nic[i]);
    }

    for (let i = 0; i < this.securityGroup.length; i++) {
      this.securityGroup[i] = new SecurityGroup(this.securityGroup[i]);
    }

    if (this.tags) {
      const group = this.tags.find(tag => tag.key === 'group');
      this.instanceGroup = group ? new InstanceGroup(group.value) : undefined;
    }
  }

  public getDisksSize(): number {
    const sizeInBytes = this.volumes.reduce((acc: number, volume: Volume) => {
      return acc + volume.size;
    }, 0);
    return sizeInBytes / Math.pow(2, 30);
  }

  public getColor(): Color {
    if (this.tags) {
      const colorTag = this.tags.find(tag => tag.key === 'color');
      if (colorTag) {
        const [backgroundColor, textColor] = colorTag.value.split(VirtualMachine.ColorDelimiter);
        return new Color(backgroundColor, backgroundColor, textColor || '');
      }
    }
    return new Color('white', '#FFFFFF', '');
  }

  public canApply(command: string): boolean {
    const state = this.state;

    if (state === 'Error' && command === 'destroy') {
      return true;
    }

    if (state !== 'Running' && state !== 'Stopped') {
      return false;
    }

    // if a vm has no ip address, it can't be reached
    // so reset password fails
    if (this.nic && this.nic.length) {
      if (command === 'resetpasswordfor' && !this.nic[0].ipAddress) {
        return false;
      }
    } else {
      return false;
    }

    switch (command) {
      case 'start':
        return state !== 'Running';
      case 'stop':
      case 'reboot':
      case 'console':
        return state !== 'Stopped';
      case 'changeOffering':
        return state === 'Stopped';
    }

    return true;
  }


}
