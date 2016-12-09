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
export class VmModel extends BaseModel {
  public displayname: string;
  public state: string;
  public serviceofferingid: string;
  public serviceofferingname: string;
  public nic: Array<INic>;
  public securitygroup: Array<ISecurityGroup>;
  public affinitygroup: Array<IAffinityGroup>;
  public zoneid: string;
  public zonename: string;
  public templateid: string;
  public templatename: string;
  // statictic
  public cpuused: string;
  public networkkbsread: number;
  public networkkbswrite: number;
  public diskkbsread: number;
  public diskkbswrite: number;
  public diskioread: number;
  public diskiowrite: number;
}
