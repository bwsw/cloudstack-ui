import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { NetworkRule, NetworkRuleType } from './security-group.model';

@Component({
  selector: 'cs-security-group-rule',
  templateUrl: './security-group-rule.component.html',
  styles: [`:host { display: table-row }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityGroupRuleComponent {
  @Input() public type: NetworkRuleType;
  @Input() public rule: NetworkRule;
  @Input() public canRemove: boolean;

  @Output() public onRemove = new EventEmitter();

  public deleting: boolean = false;

  public handleRemoveClicked() {
    this.deleting = true;
    this.onRemove.emit({ type: this.type, id: this.rule.ruleId });
  }
}
