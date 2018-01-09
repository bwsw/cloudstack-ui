import { TimeZone } from '../components/time-zone/time-zone.service';
import { AccountType } from './account.model';
import { BaseModelInterface } from './base.model';

export class AccountUser implements BaseModelInterface {
  public id?: string;
  public username?: string;
  public firstname?: string;
  public lastname?: string;
  public email?: string;
  public password?: string;
  public created?: string;
  public state?: string;
  public account?: string;
  public accounttype?: number;
  public roleid?: string;
  public roletype?: AccountType;
  public rolename?: AccountType;
  public domain?: string;
  public domainid?: string;
  public timezone?: string;
  public accountid?: string;
  public iscallerchilddomain?: boolean;
  public isdefault?: boolean;
  public secretkey?: string;
  public apikey?: string;
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
