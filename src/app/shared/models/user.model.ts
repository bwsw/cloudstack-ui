import { BaseModel } from './base.model';
import { AccountType } from './account.model';

export interface User extends BaseModel {
  account: string;
  accountid: string;
  domain: string;
  domainid: string;
  firstname: string;
  lastname: string;
  registered: boolean;
  sessionkey: string;
  timeout: number;
  timezone: string;
  type: AccountType;
  userid: string;
  username: string;

  apikey: string;
  secretkey: string;
}
