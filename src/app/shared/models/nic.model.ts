import { BaseModel } from './base.model';
import { IpAddress } from './ip-address.model';

export interface NIC extends BaseModel {
  id: string;
  broadcasturi: string;
  deviceid: string;
  gateway: string;
  ip6address: string;
  ip6cidr: string;
  ip6gateway: string;
  ipaddress: string;
  isdefault: boolean;
  isolationuri: boolean;
  macaddress: string;
  netmask: string;
  networkid: string;
  networkname: string;
  nsxlogicalswitch: string;
  nsxlogicalswitchport: string;
  secondaryip: IpAddress[];
  traffictype: string;
  type: string;
  virtualmachineid: string;
}
