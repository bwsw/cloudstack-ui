import { BaseModel } from '../shared/models';
import { FieldMapper } from '../shared/decorators';

/* TODO
  1. nicService
  2. volumesService
  3. affinitygroup
  4. need get OSType
  5. securitygroup
  6. secondaryip in INic
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
  public state: string;
  public serviceOfferingId: string;
  public serviceOfferingName: string;
  public nic: Array<INic>;
  public securityGroup: Array<ISecurityGroup>;
  public affinityGroup: Array<IAffinityGroup>;
  public zoneId: string;
  public zoneName: string;
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
