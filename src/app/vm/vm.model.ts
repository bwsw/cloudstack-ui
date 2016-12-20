import { BaseModel } from '../shared/models';
import { FieldMapper } from '../shared/decorators';
import { Volume } from '../shared/models/volume.model';
import { OsType } from '../shared/models/os-type.model';

/* TODO
  1. nicService
  2. affinityGroup
  3. securityGroup
  4. secondaryIp in INic
*/


interface IAffinityGroup {
  id: string;
  name: string;
}

interface ISecurityGroup {
  id: string;
  name: string;
}

interface INic {
  id: string;
  ipaddress: string;
  secondaryip: any;
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
})
export class VirtualMachine extends BaseModel {
  public id: string;
  public displayName: string;
  // Status
  public state: string;
  // Service Offering
  public serviceOfferingId: string;
  public serviceOfferingName: string;
  public cpuNumber: number;
  public cpuSpeed: number;
  public memory: number;
  public volumes: Array<Volume>;
  // IP addresses
  public nic: Array<INic>;
  // Security Group
  public securityGroup: Array<ISecurityGroup>;
  // Affinity Group
  public affinityGroup: Array<IAffinityGroup>;
  // Zone
  public zoneId: string;
  public zoneName: string;
  // Template
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

  public getDisksSize() {
    const sizeInBytes = this.volumes.reduce((acc: number, volume: Volume) => {
      return acc + volume.size;
    }, 0);
    return sizeInBytes / Math.pow(2, 30);
  }

  public get canApply() {
    return this.state === 'Running' || this.state === 'Stopped';
  }
}
