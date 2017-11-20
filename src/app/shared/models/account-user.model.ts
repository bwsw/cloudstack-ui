import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';
import { AccountType } from './account.model';


@FieldMapper({
  firstname: 'firstName',
  lastname: 'lastName',
  accounttype: 'accountType',
  roleid: 'roleId',
  rolename: 'roleName',
  roletype: 'roleType',
  accountid: 'accountId',
  domainid: 'domainId',
  iscallerchilddomain: 'isCallerChildDomain',
  isdefault: 'isDefault'
})
export class AccountUser extends BaseModel {
  public username: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public created: string;
  public state: string;
  public account: string;
  public accountType: number;
  public roleId: string;
  public roleType: AccountType;
  public roleName: AccountType;
  public domain: string;
  public domainId: string;
  public timezone: string;
  public accountId: string;
  public isCallerChildDomain: boolean;
  public isDefault: boolean;

  public get name(): string {
    console.log(`${this.firstName} ${this.lastName}`);
    return `${this.firstName} ${this.lastName}`;
  }
}
