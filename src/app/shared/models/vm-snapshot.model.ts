import { BaseModel } from './base.model';

export interface VmSnapshot extends BaseModel {
  account: string;
  created: string;
  current: boolean;
  description: string;
  displayname: string;
  domain: string;
  domainid: string;
  name: string;
  parent: string;
  parentName: string;
  state: string;
  type: string;
  virtualmachineid: string;
  zoneid: string;
}
