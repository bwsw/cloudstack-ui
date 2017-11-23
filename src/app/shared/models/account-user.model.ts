import { BaseModel } from './base.model';
import { AccountType } from './account.model';

export class AccountUser extends BaseModel {
  public username: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public password?: string;
  public created: string;
  public state: string;
  public account: string;
  public accounttype: number;
  public roleid: string;
  public roletype: AccountType;
  public rolename: AccountType;
  public domain: string;
  public domainid: string;
  public timezone: string;
  public accountid: string;
  public iscallerchilddomain: boolean;
  public isdefault: boolean;
  public secretkey: boolean;
  public apikey: boolean;
}
