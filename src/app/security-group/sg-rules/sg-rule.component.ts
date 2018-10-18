import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  getICMPCodeTranslationToken,
  getICMPTypeTranslationToken,
  getICMPV6CodeTranslationToken,
  getICMPV6TypeTranslationToken,
} from '../../shared/icmp/icmp-types';
import { IPVersion, NetworkRuleType } from '../sg.model';
import {
  IcmpNetworkRule,
  NetworkProtocol,
  NetworkRule,
  PortNetworkRule,
} from '../network-rule.model';
import { CidrUtils } from '../../shared/utils/cidr-utils';

@Component({
  selector: 'cs-security-group-rule',
  templateUrl: 'sg-rule.component.html',
  styleUrls: ['sg-rule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SgRuleComponent {
  @Input()
  public item: NetworkRule;
  @Input()
  public canRemove: boolean;
  @Output()
  public removed = new EventEmitter();

  public deleting = false;
  public networkProtocol = NetworkProtocol;
  public networkRuleType = NetworkRuleType;

  public get typeTranslationToken(): string {
    const typeTranslations = {
      INGRESS: 'SECURITY_GROUP_PAGE.RULES.INGRESS_DISPLAY',
      EGRESS: 'SECURITY_GROUP_PAGE.RULES.EGRESS_DISPLAY',
    };

    return typeTranslations[this.item.type.toUpperCase()];
  }

  public get protocolTranslationToken(): string {
    const protocolTranslations = {
      TCP: 'SECURITY_GROUP_PAGE.RULES.TCP',
      UDP: 'SECURITY_GROUP_PAGE.RULES.UDP',
      ICMP: 'SECURITY_GROUP_PAGE.RULES.ICMP',
    };

    return protocolTranslations[this.item.protocol.toUpperCase()];
  }

  public get icmpTypeTranslationToken(): string {
    const icmpRule: IcmpNetworkRule = this.item as IcmpNetworkRule;
    return CidrUtils.getCidrIpVersion(icmpRule.cidr) === IPVersion.ipv4
      ? getICMPTypeTranslationToken(icmpRule.icmptype)
      : getICMPV6TypeTranslationToken(icmpRule.icmptype);
  }

  public get icmpCodeTranslationToken(): string {
    const icmpRule: IcmpNetworkRule = this.item as IcmpNetworkRule;
    return CidrUtils.getCidrIpVersion(icmpRule.cidr) === IPVersion.ipv4
      ? getICMPCodeTranslationToken(icmpRule.icmptype, icmpRule.icmpcode)
      : getICMPV6CodeTranslationToken(icmpRule.icmptype, icmpRule.icmpcode);
  }

  public get ruleParams(): Object {
    const ipVersion =
      CidrUtils.getCidrIpVersion(this.item.cidr) === IPVersion.ipv4
        ? IPVersion.ipv4
        : IPVersion.ipv6;

    const params = {
      ipVersion,
      type: this.translateService.instant(this.typeTranslationToken),
      protocol: this.translateService.instant(this.protocolTranslationToken),
      cidr: this.item.cidr,
    };

    let ruleParams;

    if (this.item.protocol === 'icmp') {
      let typeTranslation = this.translateService.instant(this.icmpTypeTranslationToken);
      if (typeTranslation === this.icmpTypeTranslationToken) {
        typeTranslation = null;
      }
      let codeTranslation = this.translateService.instant(this.icmpCodeTranslationToken);
      if (codeTranslation === this.icmpCodeTranslationToken) {
        codeTranslation = null;
      }

      const icmpRule: IcmpNetworkRule = this.item as IcmpNetworkRule;
      ruleParams = {
        ...params,
        icmpType: icmpRule.icmptype,
        icmpCode: icmpRule.icmpcode,
        icmpTypeText: typeTranslation,
        icmpCodeText: codeTranslation,
      };
    } else {
      const portRule: PortNetworkRule = this.item as PortNetworkRule;
      ruleParams = {
        ...params,
        startPort: portRule.startport,
        endPort: portRule.endport,
      };
    }

    return ruleParams;
  }

  constructor(private translateService: TranslateService) {}

  public handleRemoveClicked(e: Event): void {
    e.stopPropagation();

    this.deleting = true;
    this.removed.emit({ type: this.item.type, id: this.item.ruleid });
  }

  public get startPort(): number | null {
    if (this.item.protocol === NetworkProtocol.ICMP) {
      return null;
    }

    return (this.item as PortNetworkRule).startport;
  }

  public get endPort(): number | null {
    if (this.item.protocol === NetworkProtocol.ICMP) {
      return null;
    }

    return (this.item as PortNetworkRule).endport;
  }
}
