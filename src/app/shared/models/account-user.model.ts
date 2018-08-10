import { TimeZone } from '../components/time-zone/time-zone.service';
import { AccountType } from './account.model';
import { BaseModelInterface } from './base.model';

export interface AccountUser extends BaseModelInterface {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  created: string;
  state: string;
  account: string;
  accounttype: number;
  roleid: string;
  roletype: AccountType;
  rolename: AccountType;
  domain: string;
  domainid: string;
  timezone: string;
  accountid: string;
  iscallerchilddomain: boolean;
  isdefault: boolean;
  secretkey: string;
  apikey: string;
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
