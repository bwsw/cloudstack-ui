import { TimeZone } from '../components/time-zone/time-zone.service';
import { AccountUser } from './account-user.model';
import { BaseModelInterface } from './base.model';

export const enum AccountType {
  User = '0',
  RootAdmin = '1',
  DomainAdmin = '2'
}

export const AccountState = {
  enabled: 'enabled',
  disabled: 'disabled',
};

export const AccountResourceType = 'Account';

export interface AccountForm {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  domainid: string;
  roleid: string;
  timezone?: TimeZone;
  networkdomain?: string;
}

export class AccountData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  domainid: string;
  roleid: string;
  timezone?: string;
  networkdomain?: string;
}

export interface Account extends BaseModelInterface {
  accounttype: AccountType;
  cpuavailable: number;
  cpulimit: number;
  cputotal: number;
  domain: string;
  fullDomain: string;
  domainid: string;
  id: string;
  ipavailable: number;
  iplimit: number;
  iptotal: number;
  isdefault: false;
  memoryavailable: number;
  memorylimit: number;
  memorytotal: number;
  name: string;
  networkavailable: number;
  networklimit: number;
  networktotal: number;
  primarystorageavailable: number;
  primarystoragelimit: number;
  primarystoragetotal: number;
  role: string;
  roleid: string;
  rolename: string;
  roletype: string;
  receivedbytes: number;
  sentbytes: number;
  secondarystorageavailable: number;
  secondarystoragelimit: number;
  secondarystoragetotal: number;
  snapshotavailable: number;
  snapshotlimit: number;
  snapshottotal: number;
  state: string;
  templateavailable: number;
  templatelimit: number;
  templatetotal: number;
  user: Array<AccountUser>;
  vmavailable: number;
  vmlimit: number;
  vmrunning: number;
  vmstopped: number;
  vmtotal: number;
  volumeavailable: number;
  volumelimit: number;
  volumetotal: number;
  vpcavailable: number;
  vpclimit: number;
  vpctotal: number;
}

export const isAdmin = (account: Account) => account.accounttype !== AccountType.User;

export const isRootAdmin = (account: Account) => account.accounttype === AccountType.RootAdmin;
