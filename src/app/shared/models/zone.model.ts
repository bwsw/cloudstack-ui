import { BaseModelInterface } from './base.model';

export class Zone implements BaseModelInterface {
  id: string;
  name: string;
  securitygroupsenabled: boolean;
  networktype: string;
  localstorageenabled: boolean;
}
