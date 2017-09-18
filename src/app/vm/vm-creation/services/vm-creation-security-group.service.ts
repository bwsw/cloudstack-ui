import { Injectable } from '@angular/core';
import { VmCreationSecurityGroupData } from '../security-group/vm-creation-security-group-data';
import { Observable } from 'rxjs/Observable';
import { SecurityGroup } from '../../../security-group/sg.model';
import { VmCreationSecurityGroupMode } from '../security-group/vm-creation-security-group-mode';
import { GROUP_POSTFIX, SecurityGroupService } from '../../../security-group/services/security-group.service';
import { NetworkRule } from '../../../security-group/network-rule.model';
import { Rules } from '../../../shared/components/security-group-builder/rules';
import { Utils } from '../../../shared/services/utils/utils.service';


@Injectable()
export class VmCreationSecurityGroupService {
  constructor(private securityGroupService: SecurityGroupService) {}

  public getSecurityGroupCreationRequest(securityGroupData: VmCreationSecurityGroupData): Observable<SecurityGroup> {
    if (securityGroupData.mode === VmCreationSecurityGroupMode.Builder) {
      const data = this.securityGroupCreationData;
      const rules = this.getSecurityGroupCreationRules(securityGroupData.rules);
      return this.securityGroupService.createPrivate(data, rules);
    } else {
      return Observable.of(securityGroupData.securityGroup);
    }
  }

  private get securityGroupCreationData(): any {
    return {
      name: this.name
    };
  }

  private get name(): string {
    return Utils.getUniqueId() + GROUP_POSTFIX;
  }

  private getSecurityGroupCreationRules(rules: Rules): { ingress: Array<NetworkRule>, egress: Array<NetworkRule> } {
    return {
      ingress: rules.ingress,
      egress: rules.egress
    }
  }
}
