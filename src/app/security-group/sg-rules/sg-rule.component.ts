import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  GetICMPCodeTranslationToken,
  GetICMPTypeTranslationToken,
  GetICMPV6CodeTranslationToken,
  GetICMPV6TypeTranslationToken
} from '../../shared/icmp/icmp-types';
import { IPVersion, NetworkRuleType } from '../sg.model';
import { NetworkProtocol, NetworkRule } from '../network-rule.model';
import { CidrUtils } from '../../shared/utils/cidr-utils';

@Component({
  selector: 'cs-security-group-rule',
  templateUrl: 'sg-rule.component.html',
  styleUrls: ['sg-rule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SgRuleComponent {
  @Input() public item: NetworkRule;
  @Input() public canRemove: boolean;
  @Output() public onRemove = new EventEmitter();

  public deleting = false;
  public NetworkProtocols = NetworkProtocol;
  public NetworkRuleTypes = NetworkRuleType;

  public get typeTranslationToken(): string {
    const typeTranslations = {
      'INGRESS': 'SECURITY_GROUP_PAGE.RULES.INGRESS_DISPLAY',
      'EGRESS': 'SECURITY_GROUP_PAGE.RULES.EGRESS_DISPLAY'
    };

    return typeTranslations[this.item.type.toUpperCase()];
  }

  public get protocolTranslationToken(): string {
    const protocolTranslations = {
      'TCP': 'SECURITY_GROUP_PAGE.RULES.TCP',
      'UDP': 'SECURITY_GROUP_PAGE.RULES.UDP',
      'ICMP': 'SECURITY_GROUP_PAGE.RULES.ICMP'
    };

    return protocolTranslations[this.item.protocol.toUpperCase()];
  }

  public get icmpTypeTranslationToken(): string {
    return CidrUtils.getCidrIpVersion(this.item.cidr) === IPVersion.ipv4
      ? GetICMPTypeTranslationToken(this.item.icmptype)
      : GetICMPV6TypeTranslationToken(this.item.icmptype);
  }

  public get icmpCodeTranslationToken(): string {
    return CidrUtils.getCidrIpVersion(this.item.cidr) === IPVersion.ipv4
      ? GetICMPCodeTranslationToken(this.item.icmptype, this.item.icmpcode)
      : GetICMPV6CodeTranslationToken(this.item.icmptype, this.item.icmpcode);
  }

  public get ruleParams(): Object {
    const ipVersion = CidrUtils.getCidrIpVersion(this.item.cidr) === IPVersion.ipv4
      ? IPVersion.ipv4
      : IPVersion.ipv6;

    const params = {
      type: this.translateService.instant(this.typeTranslationToken),
      protocol: this.translateService.instant(this.protocolTranslationToken),
      cidr: this.item.cidr,
      ipVersion
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

      ruleParams = Object.assign({}, params, {
        icmpType: this.item.icmptype,
        icmpCode: this.item.icmpcode,
        icmpTypeText: typeTranslation,
        icmpCodeText: codeTranslation
      });
    } else {
      ruleParams = Object.assign({}, params, {
        startPort: this.item.startport,
        endPort: this.item.endport
      });
    }

    return ruleParams;
  }

  constructor(private translateService: TranslateService) {
  }

  public handleRemoveClicked(e: Event): void {
    e.stopPropagation();

    this.deleting = true;
    this.onRemove.emit({ type: this.item.type, id: this.item.ruleid });
  }
}
