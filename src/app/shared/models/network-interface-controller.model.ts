import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';

@FieldMapper({
  broadcasturi: 'broadcastUri',
  deviceid: 'deviceId',
  ip6address: 'ip6Address',
  ip6cidr: 'ip6Cidr',
  ip6gateway: 'ip6Gateway',
  ipaddress: 'ipAddress',
  isdefault: 'isDefault',
  isolationuri: 'isolationUri',
  macaddress: 'macAddress',
  networkid: 'networkId',
  networkname: 'networkName',
  nsxlogicalswitch: 'nsxLogicalSwitch',
  nsxlogicalswitchport: 'nsxLogicalSwitchPort',
  secondaryip: 'secondaryIp',
  traffictype: 'trafficType',
  virtualmachineid: 'virtualMachineId'
})
export class NetworkInterfaceController extends BaseModel {
  public id: string;
  public broadcasturi: string;
  public deviceid: string;
  public gateway: string;
  public ip6address: string;
  public ip6cidr: string;
  public ip6gateway: string;
  public ipaddress: string;
  public isdefault: boolean;
  public isolationuri: boolean;
  public macaddress: string;
  public netmask: string;
  public networkid: string;
  public networkname: string;
  public nsxlogicalswitch: string;
  public nsxlogicalswitchport: string;
  public secondaryip: any;
  public traffictype: string;
  public type: string;
  public virtualmachineid: string;
}
