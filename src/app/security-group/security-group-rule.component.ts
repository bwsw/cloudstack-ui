import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { NetworkRule } from './security-group.model';

@Component({
  selector: 'cs-security-group-rule',
  templateUrl: './security-group-rule.component.html',
  styles: [`:host { display: table-row }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityGroupRuleComponent {
  @Input() public type: 'Ingress'|'Egress';
  @Input() public rule: NetworkRule;
  @Input() public canRemove: boolean;

  @Output() public onRemove = new EventEmitter();
}
