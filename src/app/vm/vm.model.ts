import { BaseModel } from '../shared/models';
import { FieldMapper } from '../shared/decorators';

/* TODO
  1. nicService
  2. volumeService
  3. affinityGroup
  4. need to get OSType
  5. securityGroup
  6. secondaryIp in INic
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
  cpuused: 'cpuUsed',
  networkkbsread: 'networkKbsRead',
  networkkbswrite: 'networkKbsWrite',
  diskkbsread: 'diskKbsRead',
  diskkbswrite: 'diskKbsWrite',
  diskioread: 'diskIoRead',
  diskiowrite: 'diskIoWrite'
})
export class VirtualMachine extends BaseModel {
  public displayName: string;
  // Status
  public state: string;
  // Service Offering
  public serviceOfferingId: string;
  public serviceOfferingName: string;
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
  // statictic
  public cpuUsed: string;
  public networkKbsRead: number;
  public networkKbsWrite: number;
  public diskKbsRead: number;
  public diskKbsWrite: number;
  public diskIoRead: number;
  public diskIoWrite: number;
}
