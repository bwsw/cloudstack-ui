import { Component, Input } from '@angular/core';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroup } from './security-group.model';

@Component({
  selector: 'cs-security-group-rules',
  templateUrl: './security-group-rules.component.html',
  styleUrls: ['./security-group-rules.component.html']
})
export class SecurityGroupRulesComponent {
  @Input() public securityGroup: SecurityGroup;

  public type: 'Ingress'|'Egress';
  public protocol: 'TCP'|'UDP'|'ICMP';
  public startPort: number; // TODO validation
  public icmpType: number;
  public icmpCode: number;
  public endPort: number;
  public cidr: string;

  constructor(private securityGroupService: SecurityGroupService) {
    this.protocol = 'TCP';
    this.type = 'Ingress';
  }

  public addRule() {
    const params: any = {
      securitygroupid: this.securityGroup.id,
      protocol: this.protocol.toLowerCase(),
      cidrlist: this.cidr
    };

    if (this.protocol === 'TCP' || this.protocol === 'UDP') {
      params.startport = this.startPort;
      params.endport = this.endPort;
    } else {
      params.icmptype = this.icmpType;
      params.icmpcode = this.icmpCode;
    }
    this.securityGroupService.addRule(this.type, params)
      .then(res => console.log(res));
  }
}
