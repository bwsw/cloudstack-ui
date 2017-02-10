import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { NetworkRule, NetworkRuleType } from '../sg.model';


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

  public handleRemoveClicked(e: Event): void {
    e.stopPropagation();

    this.deleting = true;
    this.onRemove.emit({ type: this.type, id: this.rule.ruleId });
  }
}
