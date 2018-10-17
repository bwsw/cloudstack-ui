import { BaseModel } from '../shared/models/base.model';

export interface Event extends BaseModel {
  id: string;
  type: string;
  time: string;
  level: string;
  description: string;
  account: string;
  domainid: string;
  domain: string;
  created: Date;
  state: string;
  parentid: string;
}
