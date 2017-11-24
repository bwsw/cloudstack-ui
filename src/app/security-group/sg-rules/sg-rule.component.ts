import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { NetworkProtocol, NetworkRule } from '../network-rule.model';
import { TranslateService } from '@ngx-translate/core';
import {
  GetICMPCodeTranslationToken,
  GetICMPTypeTranslationToken
} from '../../shared/icmp/icmp-types';

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
    return GetICMPTypeTranslationToken(this.item.icmpType);
  }

  public get icmpCodeTranslationToken(): string {
    return GetICMPCodeTranslationToken(this.item.icmpType, this.item.icmpCode);
  }

  public get ruleParams(): Object {
    const params = {
      type: this.translateService.instant(this.typeTranslationToken),
      protocol: this.translateService.instant(this.protocolTranslationToken),
      cidr: this.item.CIDR,
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
        icmpType: this.item.icmpType,
        icmpCode: this.item.icmpCode,
        icmpTypeText: typeTranslation,
        icmpCodeText: codeTranslation
      });
    } else {
      ruleParams = Object.assign({}, params, {
        startPort: this.item.startPort,
        endPort: this.item.endPort
      });
    }

    return ruleParams;
  }

  constructor(private translateService: TranslateService) {
  }

  public handleRemoveClicked(e: Event): void {
    e.stopPropagation();

    this.deleting = true;
    this.onRemove.emit({ type: this.item.type, id: this.item.ruleId });
  }
}
