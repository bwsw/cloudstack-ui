import { TimeZone } from '../components/time-zone/time-zone.service';
import { AccountType } from './account.model';
import { BaseModel } from './base.model';

export interface AccountUser extends BaseModel {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  created: string;
  state: string;
  account: string;
  accounttype: number;
  roletype: AccountType;
  rolename: AccountType;
  roleid: string;
  domain: string;
  domainid: string;
  timezone: string;
  accountid: string;
  iscallerchilddomain: boolean;
  isdefault: boolean;
  password?: string;
  apikey?: string;
  secretkey?: string;
}

export interface ApiKeys {
  apikey: string;
  secretkey: string;
}

export interface AccountUserForm {
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  timezone?: TimeZone;
}
