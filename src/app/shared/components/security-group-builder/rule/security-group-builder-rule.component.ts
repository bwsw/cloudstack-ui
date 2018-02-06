import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NetworkProtocol } from '../../../../security-group/network-rule.model';
import {
  GetICMPCodeTranslationToken,
  GetICMPTypeTranslationToken
} from '../../../icmp/icmp-types';
import { RuleListItem } from '../security-group-builder.component';


@Component({
  selector: 'cs-security-group-builder-rule',
  templateUrl: 'security-group-builder-rule.component.html'
})
export class SecurityGroupBuilderRuleComponent {
  @Input() public item: RuleListItem;
  @Input() public type: string;
  @Output() public onCheckChange = new EventEmitter<RuleListItem>();

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
    return GetICMPTypeTranslationToken(this.item.rule.icmptype);
  }

  public get icmpCodeTranslationToken(): string {
    return GetICMPCodeTranslationToken(this.item.rule.icmptype, this.item.rule.icmpcode);
  }

  public get ruleParams(): Object {
    const params = {
      type: this.translateService.instant(this.typeTranslationToken),
      protocol: this.translateService.instant(this.protocolTranslationToken),
      cidr: this.item.rule.cidr,
    };

    let ruleParams;

    if (this.item.rule.protocol === 'icmp') {
      let typeTranslation = this.translateService.instant(this.icmpTypeTranslationToken);
      if (typeTranslation === this.icmpTypeTranslationToken) {
        typeTranslation = null;
      }
      let codeTranslation = this.translateService.instant(this.icmpCodeTranslationToken);
      if (codeTranslation === this.icmpCodeTranslationToken) {
        codeTranslation = null;
      }

      ruleParams = Object.assign({}, params, {
        icmptype: this.item.rule.icmptype,
        icmpcode: this.item.rule.icmpcode,
        icmpTypeText: typeTranslation,
        icmpCodeText: codeTranslation
      });
    } else {
      ruleParams = Object.assign({}, params, {
        startport: this.item.rule.startport,
        endport: this.item.rule.endport
      });
    }

    return ruleParams;
  }

  constructor(private translateService: TranslateService) {
  }
}
