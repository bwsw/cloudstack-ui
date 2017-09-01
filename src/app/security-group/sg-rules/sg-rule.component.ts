import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { NetworkRule, NetworkRuleType, NetworkProtocol } from '../sg.model';
import { TranslateService } from '@ngx-translate/core';
import { GetICMPCodeTranslationToken, GetICMPTypeTranslationToken } from '../icmp-types';

@Component({
  selector: 'cs-security-group-rule',
  templateUrl: 'sg-rule.component.html',
  styles: [`:host { display: table-row }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SgRuleComponent {
  @Input() public type: NetworkRuleType;
  @Input() public rule: NetworkRule;
  @Input() public canRemove: boolean;
  @Output() public onRemove = new EventEmitter();

  public deleting = false;
  public NetworkProtocols = NetworkProtocol;

  public get typeTranslationToken(): string {
    const typeTranslations = {
      'INGRESS': 'SECURITY_GROUP_PAGE.RULES.INGRESS_DISPLAY',
      'EGRESS': 'SECURITY_GROUP_PAGE.RULES.EGRESS_DISPLAY'
    };

    return typeTranslations[this.type.toUpperCase()];
  }

  public get protocolTranslationToken(): string {
    const protocolTranslations = {
      'TCP': 'SECURITY_GROUP_PAGE.RULES.TCP',
      'UDP': 'SECURITY_GROUP_PAGE.RULES.UDP',
      'ICMP': 'SECURITY_GROUP_PAGE.RULES.ICMP'
    };

    return protocolTranslations[this.rule.protocol.toUpperCase()];
  }

  public get icmpTypeTranslationToken(): string {
    return GetICMPTypeTranslationToken(this.rule.icmpType);
  }

  public get icmpCodeTranslationToken(): string {
    return GetICMPCodeTranslationToken(this.rule.icmpType, this.rule.icmpCode);
  }

  public get ruleParams(): Object {
    const params = {
      type: this.translateService.instant(this.typeTranslationToken),
      protocol: this.translateService.instant(this.protocolTranslationToken),
      cidr: this.rule.CIDR,
    };

    let ruleParams;

    if (this.rule.protocol === 'icmp') {
      let typeTranslation = this.translateService.instant(this.icmpTypeTranslationToken);
      if (typeTranslation === this.icmpTypeTranslationToken) {
        typeTranslation = null;
      }
      let codeTranslation = this.translateService.instant(this.icmpCodeTranslationToken);
      if (codeTranslation === this.icmpCodeTranslationToken) {
        codeTranslation = null;
      }

      ruleParams = Object.assign({}, params, {
        icmpType: this.rule.icmpType,
        icmpCode: this.rule.icmpCode,
        icmpTypeText: typeTranslation,
        icmpCodeText: codeTranslation
      });
    } else {
      ruleParams = Object.assign({}, params, {
        startPort: this.rule.startPort,
        endPort: this.rule.endPort
      });
    }

    return ruleParams;
  }

  constructor(private translateService: TranslateService) {
  }

  public handleRemoveClicked(e: Event): void {
    e.stopPropagation();

    this.deleting = true;
    this.onRemove.emit({ type: this.type, id: this.rule.ruleId });
  }
}
