import { BaseModel } from './base.model';
import { AccountUser } from './account-user.model';
import { TimeZone } from '../components/time-zone/time-zone.service';

export const enum AccountType {
  User = 0,
  RootAdmin = 1,
  DomainAdmin = 2
}

export const AccountState = {
  enabled: 'enabled',
  disabled: 'disabled',
  locked: 'locked',
};

export class AccountData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  domainid: string;
  account: string;
  roleid: string;
  timezone: TimeZone;
  networkdomain: string;
}

export class Account extends BaseModel {
  public accounttype: AccountType;
  public cpuavailable: number;
  public cpulimit: number;
  public cputotal: number;
  public domain: string;
  public fullDomain: string;
  public domainid: string;
  public id: string;
  public ipavailable: number;
  public iplimit: number;
  public iptotal: number;
  public isdefault: false;
  public memoryavailable: number;
  public memorylimit: number;
  public memorytotal: number;
  public name: string;
  public networkavailable: number;
  public networklimit: number;
  public networktotal: number;
  public primarystorageavailable: number;
  public primarystoragelimit: number;
  public primarystoragetotal: number;
  public role: string;
  public roleid: string;
  public rolename: string;
  public roletype: string;
  public receivedbytes: number;
  public sentbytes: number;
  public secondarystorageavailable: number;
  public secondarystoragelimit: number;
  public secondarystoragetotal: number;
  public snapshotavailable: number;
  public snapshotlimit: number;
  public snapshottotal: number;
  public state: string;
  public templateavailable: number;
  public templatelimit: number;
  public templatetotal: number;
  public user: Array<AccountUser>;
  public vmavailable: number;
  public vmlimit: number;
  public vmrunning: number;
  public vmstopped: number;
  public vmtotal: number;
  public volumeavailable: number;
  public volumelimit: number;
  public volumetotal: number;
  public vpcavailable: number;
  public vpclimit: number;
  public vpctotal: number;

  constructor(json?: any) {
    // TODO temporary workaround to fix *available and *limit fields in the json
    // This field is either a string representation of a number or 'Unlimited'
    // The code below converts it to number (-1 if unlimited);
    const fixedJson = { ...json };
    Object.keys(fixedJson)
      .filter(key => key.endsWith('available') || key.endsWith('limit'))
      .forEach(key => {
        if (fixedJson[key] === 'Unlimited') {
          fixedJson[key] = Infinity;
        } else {
          const temp = +fixedJson[key];
          if (!isNaN(temp)) {
            fixedJson[key] = temp;
          }
        }
      });
    super(fixedJson);
  }

  public get isAdmin() {
    return this.accounttype !== AccountType.User;
  }

  public get isRootAdmin() {
    return this.accounttype === AccountType.RootAdmin;
  }
}
