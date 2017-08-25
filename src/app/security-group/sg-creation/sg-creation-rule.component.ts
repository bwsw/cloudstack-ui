import { Component, Input } from '@angular/core';
import {
  GetICMPCodeTranslationToken, GetICMPTypeTranslationToken,
  NetworkProtocol
} from '../sg.model';
import { RuleListItem } from './sg-creation.component';


@Component({
  selector: 'cs-sg-creation-rule',
  templateUrl: 'sg-creation-rule.component.html'
})
export class SgCreationRuleComponent {
  @Input() public item: RuleListItem;
  @Input() public type: string;

  public NetworkProtocols = NetworkProtocol;

  public get protocolTranslationToken(): string {
    const protocolTranslations = {
      'TCP': 'SECURITY_GROUP_PAGE.RULES.TCP',
      'UDP': 'SECURITY_GROUP_PAGE.RULES.UDP',
      'ICMP': 'SECURITY_GROUP_PAGE.RULES.ICMP'
    };

    return protocolTranslations[this.item.rule.protocol.toUpperCase()];
  }

  public get typeTranslationToken(): string {
    const typeTranslations = {
      'INGRESS': 'SECURITY_GROUP_PAGE.RULES.INGRESS_DISPLAY',
      'EGRESS': 'SECURITY_GROUP_PAGE.RULES.EGRESS_DISPLAY'
    };

    return typeTranslations[this.type.toUpperCase()];
  }

  public get icmpTypeTranslationToken(): string {
    return GetICMPTypeTranslationToken(this.item.rule.icmpType);
  }

  public get icmpCodeTranslationToken(): string {
    return GetICMPCodeTranslationToken(this.item.rule.icmpType, this.item.rule.icmpCode);
  }
}
