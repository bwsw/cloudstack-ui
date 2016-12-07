import { Injectable } from '@angular/core';
import { ConfigService } from '..';

export interface INetworkSecurityGroup {
  name: string;
  rules: Array<INetworkRule>;
}

export interface INetworkRule {
  type: string;
  protocol: string;
  firstPort: number;
  lastPort: number;
}

@Injectable()
export class SecurityGroupService {

  constructor(private config: ConfigService) {}

  public getTemplates(): Promise<Array<INetworkSecurityGroup>> {
    return this.config.get('securityGroupTemplates');
  }
}
