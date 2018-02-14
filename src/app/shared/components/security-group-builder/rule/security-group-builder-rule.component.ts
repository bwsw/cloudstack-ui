import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NetworkProtocol } from '../../../../security-group/network-rule.model';
import {
  GetICMPCodeTranslationToken,
  GetICMPTypeTranslationToken
} from '../../../icmp/icmp-types';
import { Utils } from '../../../services/utils/utils.service';
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

  public get ruleTranslationToken(): { tooltip: string, name: string } {
    if (this.item.rule.protocol === NetworkProtocol.ICMP) {
      if (!this.ruleParams['icmpTypeText'] && !this.ruleParams['icmpCodeText']) {
        return {
          tooltip: `SECURITY_GROUP_PAGE.RULES.NO_TEXT_${this.item.type.toUpperCase()}_ICMP_RULE_NOMARKUP`,
          name: `SECURITY_GROUP_PAGE.RULES.NO_TEXT_${this.item.type.toUpperCase()}_ICMP_RULE`
        };
      } else if (!this.ruleParams['icmpCodeText'] && !!this.ruleParams['icmpTypeText']) {
        return {
          tooltip: `SECURITY_GROUP_PAGE.RULES.NO_CODE_${this.item.type.toUpperCase()}_ICMP_RULE_NOMARKUP`,
          name: `SECURITY_GROUP_PAGE.RULES.NO_CODE_${this.item.type.toUpperCase()}_ICMP_RULE`
        };
      } else if (this.ruleParams['icmpCodeText'] && this.ruleParams['icmpTypeText']) {
        return {
          tooltip: `SECURITY_GROUP_PAGE.RULES.${this.item.type.toUpperCase()}_ICMP_RULE_NOMARKUP`,
          name: `SECURITY_GROUP_PAGE.RULES.${this.item.type.toUpperCase()}_ICMP_RULE`
        };
      }
    } else {
      if (this.item.rule.startport === this.item.rule.endport) {
        return {
          tooltip: `SECURITY_GROUP_PAGE.RULES.${this.item.type.toUpperCase()}_RULE_NOMARKUP`,
          name: `SECURITY_GROUP_PAGE.RULES.${this.item.type.toUpperCase()}_RULE`
        };
      } else {
        return {
          tooltip: `SECURITY_GROUP_PAGE.RULES.${this.item.type.toUpperCase()}_RULE_PORT_RANGE_NOMARKUP`,
          name: `SECURITY_GROUP_PAGE.RULES.${this.item.type.toUpperCase()}_RULE_PORT_RANGE`
        };
      }
    }
  }

  public get ruleParams(): Object {
    const params = {
      type: this.translateService.instant(this.typeTranslationToken),
      protocol: this.translateService.instant(this.protocolTranslationToken),
      cidr: this.item.rule.cidr,
      ipVersion: Utils.cidrType(this.item.rule.cidr)
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
