import { TimeZone } from '../components/time-zone/time-zone.service';
import { AccountUser } from './account-user.model';
import { BaseModel } from './base.model';

export const enum AccountType {
  User = '0',
  RootAdmin = '1',
  DomainAdmin = '2',
}

export const accountState = {
  enabled: 'enabled',
  disabled: 'disabled',
};

export const accountResourceType = 'Account';

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

export interface Account extends BaseModel {
  accounttype: AccountType;
  cpuavailable: string;
  cpulimit: string;
  cputotal: number;
  domain: string;
  domainid: string;
  id: string;
  ipavailable: string;
  iplimit: string;
  iptotal: number;
  isdefault: false;
  memoryavailable: string;
  memorylimit: string;
  memorytotal: number;
  name: string;
  networkavailable: string;
  networklimit: string;
  networktotal: number;
  primarystorageavailable: string;
  primarystoragelimit: string;
  primarystoragetotal: number;
  roleid: string;
  rolename: string;
  roletype: string;
  receivedbytes?: number;
  sentbytes?: number;
  secondarystorageavailable: string;
  secondarystoragelimit: string;
  secondarystoragetotal: number;
  snapshotavailable: string;
  snapshotlimit: string;
  snapshottotal: number;
  state: string;
  templateavailable: string;
  templatelimit: string;
  templatetotal: number;
  user: AccountUser[];
  vmavailable: string;
  vmlimit: string;
  vmrunning: number;
  vmstopped: number;
  vmtotal: number;
  volumeavailable: string;
  volumelimit: string;
  volumetotal: number;
  vpcavailable: string;
  vpclimit: string;
  vpctotal: number;
  role?: string;
  fullDomain?: string;
}

export const isAdmin = (account: Account) => account.accounttype !== AccountType.User;

export const isRootAdmin = (account: Account) => account.accounttype === AccountType.RootAdmin;
