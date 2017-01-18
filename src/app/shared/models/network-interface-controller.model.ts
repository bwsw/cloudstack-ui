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
  public broadcastUri: string;
  public deviceId: string;
  public gateway: string;
  public ip6Address: string;
  public ip6Cidr: string;
  public ip6Gateway: string;
  public ipAddress: string;
  public isDefault: boolean;
  public isolationUri: boolean;
  public macAddress: string;
  public netmask: string;
  public networkId: string;
  public networkName: string;
  public nsxLogicalSwitch: string;
  public nsxLogicalSwitchPort: string;
  public secondaryIp: any;
  public trafficType: string;
  public type: string;
  public virtualmachineId: string;
}
