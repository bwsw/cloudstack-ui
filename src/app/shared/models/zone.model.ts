import { BaseModel } from './base.model';

export interface Zone extends BaseModel {
  id: string;
  name: string;
  securitygroupsenabled: boolean;
  networktype: string;
  localstorageenabled: boolean;
}
