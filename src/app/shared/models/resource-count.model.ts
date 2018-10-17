import { BaseModel } from './base.model';

/*export const enum ResourceType {
  Instance, // Number of instances a user can create
  IP, // Number of public IP addresses an account can own
  Volume, // Number of disk volumes an account can own
  Snapshot, // Number of snapshots an account can own
  Template, // Number of templates an account can register/create
  Project, // Number of projects an account can own
  Network, // Number of networks an account can own
  VPC, // Number of VPC an account can own
  CPU, // Number of CPU an account can allocate for his resources
  Memory, // Amount of RAM an account can allocate for his resources
  PrimaryStorage, // Total primary storage space (in GiB) a user can use
  SecondaryStorage // Total secondary storage space (in GiB) a user can use
}
*/

export interface ResourceCount extends BaseModel {
  id?: string;
  account: string;
  domain: string;
  domainid: string;
  resourcecount: number;
  resourcetype: number;
}
