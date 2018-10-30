import { BaseModel } from './base.model';

export interface Domain extends BaseModel {
  cpuavailable: number;
  cpulimit: number;
  cputotal: number;
  haschild: boolean;
  id: string;
  ipavailable: string;
  iplimit: string;
  iptotal: number;
  level: number;
  memoryavailable: string;
  memorylimit: string;
  memorytotal: number;
  name: string;
  networkavailable: string;
  networkdomain: string;
  networklimit: string;
  networktotal: number;
  parentdomainid: string;
  parentdomainname: string;
  path: string;
  primarystorageavailable: string;

  primarystoragelimit: string;
  primarystoragetotal: number;
  projectavailable: string;
  projectlimit: string;
  projecttotal: number;
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
  vmavailable: string;
  vmlimit: string;
  vmtotal: number;
  volumeavailable: string;
  volumelimit: string;
  volumetotal: number;
  vpcavailable: string;
  vpclimit: string;
  vpctotal: number;
}

export const getPath = (domain: Domain) => {
  return domain.path === 'ROOT' ? '' : `${domain.path.replace('ROOT/', '')}/`;
};
