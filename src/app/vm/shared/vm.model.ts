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
import { Taggable } from '../../shared/interfaces/taggable.interface';


export const MAX_ROOT_DISK_SIZE_ADMIN = 200;

export interface IVmAction {
  name: string;
  commandName: string;
  nameLower: string;
  nameCaps: string;
  vmStateOnAction: string;
  vmActionCompleted: string;
  mdlIcon?: string;
  confirmMessage: string;
  progressMessage: string;
  successMessage: string;
}

type PredefinedStates = 'Running' | 'Stopped' | 'Error' | 'Destroyed' | 'Expunged';
type CustomStates = 'Deploying' | 'Expunging';
export type VmState = PredefinedStates | CustomStates;
export const VmStates = {
  Running: 'Running' as VmState,
  Stopped: 'Stopped' as VmState,
  Error: 'Error' as VmState,
  Destroyed: 'Destroyed' as VmState,
  Expunged: 'Expunged' as VmState,
  Deploying: 'Deploying' as VmState,
  Expunging: 'Expunging' as VmState
};

export type VmAction =
    'start'
  | 'stop'
  | 'reboot'
  | 'restore'
  | 'destroy'
  | 'resetPasswordFor'
  | 'console'
  | 'webShell';

export const VmActions = {
  START: 'start' as VmAction,
  STOP: 'stop' as VmAction,
  REBOOT: 'reboot' as VmAction,
  RESTORE: 'restore' as VmAction,
  DESTROY: 'destroy' as VmAction,
  RESET_PASSWORD: 'resetPasswordFor' as VmAction,
  CONSOLE: 'console' as VmAction,
  WEB_SHELL: 'webShell' as VmAction
};

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
  isoid: 'isoId',
  passwordenabled: 'passwordEnabled'
})
export class VirtualMachine extends BaseModel implements Taggable {
  public static ColorDelimiter = ';';
  public resourceType = 'UserVm';

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
  public passwordEnabled: boolean;
  public tags: Array<Tag>;
  public instanceGroup: InstanceGroup;

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
      this.tags = this.tags.map(tag => new Tag(tag));
      const group = this.tags.find(tag => tag.key === 'group');
      this.instanceGroup = group ? new InstanceGroup(group.value) : undefined;
    }
  }

  public get ipIsAvailable(): boolean {
    return this.nic.length && !!this.nic[0].ipAddress;
  }

  public getDisksSize(): number {
    const sizeInBytes = this.volumes && this.volumes.reduce((acc: number, volume: Volume) => {
      return acc + volume.size;
    }, 0) || 0;
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
}
