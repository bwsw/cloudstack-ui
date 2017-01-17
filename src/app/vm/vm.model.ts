import { BaseModel } from '../shared/models';
import { FieldMapper } from '../shared/decorators';
import { Volume } from '../shared/models/volume.model';
import { NetworkInterfaceController } from '../shared/models';
import { OsType } from '../shared/models/os-type.model';
import { ServiceOffering } from '../shared/models/service-offering.model';
import { Template } from '../shared/models/template.model';

export const MIN_ROOT_DISK_SIZE = 10;
export const MAX_ROOT_DISK_SIZE_ADMIN = 200;

interface IAffinityGroup {
  id: string;
  name: string;
}

interface ISecurityGroup {
  id: string;
  name: string;
}

export interface IVmAction {
  name: string;
  nameLower: string;
  nameCaps: string;
  vmStateOnAction: string;
  vmActionCompleted: string;
  mdlIcon: string;
  confirmMessage: string;
  progressMessage: string;
  successMessage: string;
}

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
  keypair: 'keyPair'
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
  public nic: Array<NetworkInterfaceController>;
  // Security Group
  public securityGroup: Array<ISecurityGroup>;
  // Affinity Group
  public affinityGroup: Array<IAffinityGroup>;
  // Zone
  public zoneId: string;
  public zoneName: string;
  // Template
  public template: Template;
  public templateId: string;
  public templateName: string;
  public osType: OsType;
  public guestOsId: string;
  // CUSTOM
  public pending: boolean;
  // statictics
  public cpuUsed: string;
  public networkKbsRead: number;
  public networkKbsWrite: number;
  public diskKbsRead: number;
  public diskKbsWrite: number;
  public diskIoRead: number;
  public diskIoWrite: number;
  // misc
  public keyPair: string;

  public get actions(): Array<string> {
    return [
      'start',
      'stop',
      'reboot',
      'restore',
      'destroy'
    ];
  }

  public getDisksSize() {
    const sizeInBytes = this.volumes.reduce((acc: number, volume: Volume) => {
      return acc + volume.size;
    }, 0);
    return sizeInBytes / Math.pow(2, 30);
  }

  public canApply(command: string) {
    const state = this.state;

    if (state !== 'Running' && state !== 'Stopped') {
      return false;
    }

    switch (command) {
      case 'start': return state !== 'Running';
      case 'stop':
      case 'reboot':
        return state !== 'Stopped';
    }

    return true;
  }

  public static getAction(action: string): IVmAction  {
    let name = action.charAt(0).toUpperCase() + action.slice(1);
    let nameLower = action;
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
    }
    return {
      name,
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
