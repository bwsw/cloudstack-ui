import { BaseModel } from './base.model';

export const enum AccountType {
  User = 0,
  Admin,
  DomainAdmin
}

export class Account extends BaseModel {
  public accounttype: AccountType;
  public cpuavailable: number;
  public cpulimit: number;
  public cputotal: number;
  public domain: string;
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
  public roleid: string;
  public rolename: string;
  public roletype: string;
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
}
