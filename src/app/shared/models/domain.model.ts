import { BaseModel } from './base.model';

export class Domain extends BaseModel {
  public cpuavailable: number;
  public cpulimit: number;
  public cputotal: number;
  public haschild: boolean;
  public id: string;
  public ipavailable: string;
  public iplimit: string;
  public iptotal: number;
  public level: number;
  public memoryavailable: string;
  public memorylimit: string;
  public memorytotal: number;
  public name: string;
  public networkavailable: string;
  public networkdomain: string;
  public networklimit: string;
  public networktotal: number;
  public parentdomainid: string;
  public parentdomainname: string;
  public path: string;
  public primarystorageavailable: string;

  public primarystoragelimit: string;
  public primarystoragetotal: number;
  public projectavailable: string;
  public projectlimit: string;
  public projecttotal: number;
  public secondarystorageavailable: string;
  public secondarystoragelimit: string;
  public secondarystoragetotal: number;
  public snapshotavailable: string;
  public snapshotlimit: string;
  public snapshottotal: number;
  public state: string;
  public templateavailable: string;
  public templatelimit: string;
  public templatetotal: number;
  public vmavailable: string;
  public vmlimit: string;
  public vmtotal: number;
  public volumeavailable: string;
  public volumelimit: string;
  public volumetotal: number;
  public vpcavailable: string;
  public vpclimit: string;
  public vpctotal: number;

  public getPath(): string {
    return this.path === 'ROOT' ? '' : this.path.replace('ROOT/','') + '/';
  }
}
