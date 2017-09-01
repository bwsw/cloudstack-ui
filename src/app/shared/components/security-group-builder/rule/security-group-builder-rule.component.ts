import { Component, Input } from '@angular/core';
import { NetworkProtocol } from '../../../../security-group/network-rule.model';
import { RuleListItem } from '../security-group-builder.component';


@Component({
  selector: 'cs-security-group-builder-rule',
  templateUrl: 'security-group-builder-rule.component.html'
})
export class SecurityGroupBuilderRuleComponent {
  @Input() public item: RuleListItem;
  @Input() public type: string;

  public NetworkProtocols = NetworkProtocol;
}
