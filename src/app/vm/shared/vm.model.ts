import { FieldMapper } from '../../shared/decorators';

import {
  BaseModel,
  NIC,
  OsType,
  ServiceOffering,
  Volume
} from '../../shared/models';
import { SecurityGroup } from '../../security-group/sg.model';
import { BaseTemplateModel } from '../../template/shared/base-template.model';
import { ZoneName } from '../../shared/decorators/zone-name.decorator';
import { Tag } from '../../shared/models/tag.model';


export const MIN_ROOT_DISK_SIZE = 10;
export const MAX_ROOT_DISK_SIZE_ADMIN = 200;

interface IAffinityGroup {
  id: string;
  name: string;
}

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
  public id: string;
  public displayName: string;
  // Status
  public state: string;
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
  public affinityGroup: Array<IAffinityGroup>;
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
  public group: string;
  public keyPair: string;
  public password: string;
  public tags: Array<Tag>;

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
  }

  public get actions(): Array<string> {
    return [
      'start',
      'stop',
      'reboot',
      'restore',
      'destroy',
      'resetPasswordFor', // name forced by API and action implementation,
      'console'
    ];
  }

  public getDisksSize(): number {
    const sizeInBytes = this.volumes.reduce((acc: number, volume: Volume) => {
      return acc + volume.size;
    }, 0);
    return sizeInBytes / Math.pow(2, 30);
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
    if (command === 'resetpasswordfor' && !this.nic[0].ipAddress) {
      return false;
    }

    switch (command) {
      case 'start': return state !== 'Running';
      case 'stop':
      case 'reboot':
      case 'console':
        return state !== 'Stopped';
      case 'changeOffering':
        return state === 'Stopped';
    }

    return true;
  }

  public static getAction(action: string): IVmAction  {
    let name = action.charAt(0).toUpperCase() + action.slice(1);
    let commandName = action;
    let nameLower = action.toLowerCase();
    let nameCaps = action.toUpperCase();
    let vmStateOnAction = nameCaps + '_IN_PROGRESS';
    let vmActionCompleted = nameCaps + '_DONE';
    let mdlIcon = '';
    let confirmMessage = 'CONFIRM_VM_' + nameCaps;
    let progressMessage = 'VM_' + nameCaps + '_IN_PROGRESS';
    let successMessage = nameCaps + '_DONE';
    switch (action) {
      case 'start':
        mdlIcon = 'play_arrow';
        break;
      case 'stop':
        mdlIcon = 'stop';
        break;
      case 'reboot':
        mdlIcon = 'replay';
        break;
      case 'restore':
        mdlIcon = 'settings_backup_restore';
        break;
      case 'destroy':
        mdlIcon = 'close';
        break;
      case 'resetPasswordFor':
        mdlIcon = 'vpn_key';
        break;
      case 'console':
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
}
