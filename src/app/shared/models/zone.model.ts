import { BaseModel } from './base.model';

export class Zone implements BaseModel {
  id: string;
  name: string;
  securitygroupsenabled: boolean;
  networktype: string;
  localstorageenabled: boolean;
}
