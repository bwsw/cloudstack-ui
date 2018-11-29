import { BaseModel } from './base.model';

export interface InstanceGroup extends BaseModel {
  id: string;
  account: string;
  created: string;
  domain: string;
  domainid: string;
  name: string;
  project?: string;
  projectid?: string;
}
