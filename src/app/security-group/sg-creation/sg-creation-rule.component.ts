import { Component, Input } from '@angular/core';
import { NetworkProtocol } from '../network-rule.model';
import { RuleListItem } from './sg-creation.component';


@Component({
  selector: 'cs-sg-creation-rule',
  templateUrl: 'sg-creation-rule.component.html'
})
export class SgCreationRuleComponent {
  @Input() public item: RuleListItem;
  @Input() public type: string;

  public NetworkProtocols = NetworkProtocol;
}
