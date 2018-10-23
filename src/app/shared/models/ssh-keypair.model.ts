import { BaseModel } from './base.model';

export interface SSHKeyPair extends BaseModel {
  name: string;
  fingerprint: string;
  privatekey: string;
  account: string;
  domainid: string;
  domain: string;
}
