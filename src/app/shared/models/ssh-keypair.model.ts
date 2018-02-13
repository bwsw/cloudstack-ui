import { BaseModelInterface } from './base.model';

export interface SSHKeyPair extends BaseModelInterface {
  name: string;
  fingerprint: string;
  privatekey: string;
  account: string;
  domainid: string;
  domain: string;
}
