import { SecurityGroup } from '../../security-group/sg.model';
import {
  FieldMapper,
  ZoneName
} from '../../shared/decorators';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import {
  BaseModel,
  InstanceGroup,
  NIC,
  OsType,
  ServiceOffering,
  Tag,
  Volume
} from '../../shared/models';
import { AffinityGroup } from '../../shared/models/affinity-group.model';
import { VirtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';
import { BaseTemplateModel } from '../../template/shared';


export enum VmState {
  Running = 'Running',
  Stopped = 'Stopped',
  Error = 'Error',
  Destroyed = 'Destroyed',
  Expunged = 'Expunged',
  InProgress = 'In-progress',
  // custom states
  Deploying = 'Deploying',
  Expunging = 'Expunging'
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
  isoid: 'isoId',
  passwordenabled: 'passwordEnabled'
})
export class VirtualMachine extends BaseModel implements Taggable {
  public static ColorDelimiter = ';';
  public resourceType = 'UserVm';

  public id: string;
  public displayName: string;
  public name: string;
  public account: string;
  public domain: string;
  public domainid: string;
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

    this.initializeNic();
    this.initializeSecurityGroups();
    this.initializeTags();
    this.initializeInstanceGroup();
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

  private initializeNic(): void {
    if (!this.nic) {
      this.nic = [];
    }

    this.nic = this.nic.map(nic => new NIC(nic));
  }

  private initializeSecurityGroups(): void {
    if (!this.securityGroup) {
      this.securityGroup = [];
    }

    this.securityGroup = this.securityGroup.map(securityGroup => {
      return new SecurityGroup(securityGroup);
    });
  }

  private initializeTags(): void {
    if (!this.tags) {
      this.tags = [];
    }

    this.tags = this.tags.map(tag => new Tag(tag));
  }

  private initializeInstanceGroup(): void {
    const group = this.tags.find(tag => tag.key === VirtualMachineTagKeys.group);

    if (group) {
      this.instanceGroup = new InstanceGroup(group.value);
    }
  }
}
