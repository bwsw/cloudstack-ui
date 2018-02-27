import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NetworkRule } from '../../../security-group/network-rule.model';
import {
  GROUP_POSTFIX,
  SecurityGroupService
} from '../../../security-group/services/security-group.service';
import { SecurityGroup } from '../../../security-group/sg.model';
import { Rules } from '../../../shared/components/security-group-builder/rules';
import { Utils } from '../../../shared/services/utils/utils.service';
import { VmCreationState } from '../data/vm-creation-state';
import { VmCreationSecurityGroupMode } from '../security-group/vm-creation-security-group-mode';


@Injectable()
export class VmCreationSecurityGroupService {
  constructor(private securityGroupService: SecurityGroupService) {
  }

  public getSecurityGroupCreationRequest(state: VmCreationState): Observable<SecurityGroup[]> {
    if (state.securityGroupData.mode === VmCreationSecurityGroupMode.Builder) {
      const data = this.securityGroupCreationData(state.displayName);
      const rules = this.getSecurityGroupCreationRules(state.securityGroupData.rules);
      return this.securityGroupService.createPrivate(data, rules)
        .map(securityGroup => [<SecurityGroup>securityGroup]);
    } else {
      return Observable.of(state.securityGroupData.securityGroups);
    }
  }


  private get name(): string {
    return Utils.getUniqueId() + GROUP_POSTFIX;
  }

  private getSecurityGroupCreationRules(rules: Rules): { ingress: Array<NetworkRule>, egress: Array<NetworkRule> } {
    return {
      ingress: rules.ingress,
      egress: rules.egress
    };
  }

  private securityGroupCreationData(vmDisplayName?: string): any {
    return {
      name: vmDisplayName ? `sg-${ vmDisplayName }` : this.name
    };
  }
}
